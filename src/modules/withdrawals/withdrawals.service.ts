import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs = require('dayjs');
import { Model, Types } from 'mongoose';
import { TransactionType, WithdrawalStatus } from '../../common/constants';
import { Withdrawal, WithdrawalDocument } from '../../schemas/withdrawal.schema';
import { InvestmentsService } from '../investments/investments.service';
import { SettingsService } from '../settings/settings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class WithdrawalsService {
  constructor(@InjectModel(Withdrawal.name) private readonly withdrawals: Model<WithdrawalDocument>, private readonly investments: InvestmentsService, private readonly settings: SettingsService, private readonly transactions: TransactionsService, private readonly users: UsersService) {}
  async request(userId: string, input: { principalAmount: number; earningsAmount: number; investmentIds?: string[] }) {
    const user = await this.users.findById(userId);
    if (input.earningsAmount > user.earningsWallet) throw new BadRequestException('Insufficient earnings wallet balance');
    const principalAmount = input.principalAmount || 0;
    const earningsAmount = input.earningsAmount || 0;
    if (principalAmount + earningsAmount <= 0) throw new BadRequestException('Withdrawal amount is required');
    const setting = await this.settings.current();
    const investmentIds = (input.investmentIds ?? []).map((id) => new Types.ObjectId(id));
    const withdrawal = await this.withdrawals.create({ userId: user._id, investmentIds, principalAmount, earningsAmount, totalAmount: principalAmount + earningsAmount, requestedAt: new Date(), expectedCompletionAt: dayjs().add(setting.withdrawalProcessingDays, 'day').toDate(), status: WithdrawalStatus.PENDING });
    if (investmentIds.length) await this.investments.freezeForWithdrawal(investmentIds, withdrawal._id);
    if (earningsAmount > 0) await this.users.adjustWallets(user._id, 0, -earningsAmount);
    await this.transactions.create({ userId: user._id, type: TransactionType.WITHDRAWAL, amount: withdrawal.totalAmount, referenceId: withdrawal.id, description: 'Withdrawal requested' });
    return withdrawal;
  }
  listForUser(userId: string) { return this.withdrawals.find({ userId }).sort({ requestedAt: -1 }); }
  listPending() { return this.withdrawals.find({ status: WithdrawalStatus.PENDING }).sort({ requestedAt: 1 }); }
  async review(adminId: string, withdrawalId: string, action: 'APPROVE' | 'REJECT', adminNote?: string) {
    const withdrawal = await this.withdrawals.findById(withdrawalId);
    if (!withdrawal || withdrawal.status !== WithdrawalStatus.PENDING) throw new BadRequestException('Pending withdrawal not found');
    withdrawal.reviewedAt = new Date();
    withdrawal.reviewedBy = new Types.ObjectId(adminId);
    withdrawal.adminNote = adminNote;
    if (action === 'REJECT') {
      withdrawal.status = WithdrawalStatus.REJECTED;
      await withdrawal.save();
      if (withdrawal.investmentIds.length) await this.investments.resume(withdrawal.investmentIds);
      if (withdrawal.earningsAmount > 0) await this.users.adjustWallets(withdrawal.userId, 0, withdrawal.earningsAmount);
      return withdrawal;
    }
    withdrawal.status = WithdrawalStatus.COMPLETED;
    await withdrawal.save();
    if (withdrawal.investmentIds.length) await this.investments.close(withdrawal.investmentIds);
    await this.users.adjustWallets(withdrawal.userId, -withdrawal.principalAmount, 0, withdrawal.totalAmount);
    return withdrawal;
  }
}
