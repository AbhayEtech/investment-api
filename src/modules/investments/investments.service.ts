import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs = require('dayjs');
import { Model, Types } from 'mongoose';
import { InvestmentStatus, TransactionType } from '../../common/constants';
import { Investment, InvestmentDocument } from '../../schemas/investment.schema';
import { SettingsService } from '../settings/settings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class InvestmentsService {
  constructor(@InjectModel(Investment.name) private readonly investments: Model<InvestmentDocument>, private readonly settings: SettingsService, private readonly transactions: TransactionsService, private readonly users: UsersService) {}
  async createAfterPayment(userId: string, grossAmount: number, paymentId: string) {
    const setting = await this.settings.current();
    const gstDeducted = this.round(grossAmount * (setting.gstRate / 100));
    const netInvestedAmount = this.round(grossAmount - gstDeducted);
    const investmentDate = new Date();
    const investment = await this.investments.create({ userId: new Types.ObjectId(userId), grossAmount, gstDeducted, netInvestedAmount, remainingPrincipal: netInvestedAmount, annualReturnRate: setting.annualReturnRate, gstRate: setting.gstRate, lockPeriodDays: setting.lockPeriodDays, investmentDate, earningStartDate: dayjs(investmentDate).add(setting.lockPeriodDays, 'day').startOf('day').toDate(), status: InvestmentStatus.ACTIVE });
    await this.users.adjustWallets(investment.userId, netInvestedAmount);
    await this.transactions.create({ userId: investment.userId, type: TransactionType.DEPOSIT, amount: grossAmount, referenceId: paymentId, description: 'Razorpay deposit' });
    await this.transactions.create({ userId: investment.userId, type: TransactionType.GST, amount: gstDeducted, referenceId: investment.id, description: 'GST deducted from investment' });
    return investment;
  }
  listForUser(userId: string) { return this.investments.find({ userId }).sort({ investmentDate: -1 }); }
  activeReadyForEarnings(today: Date) { return this.investments.find({ status: InvestmentStatus.ACTIVE, earningStartDate: { $lte: today }, remainingPrincipal: { $gt: 0 } }); }
  freezeForWithdrawal(investmentIds: Types.ObjectId[], withdrawalId: Types.ObjectId) { return this.investments.updateMany({ _id: { $in: investmentIds }, status: InvestmentStatus.ACTIVE }, { $set: { status: InvestmentStatus.PENDING_WITHDRAWAL, pendingWithdrawalId: withdrawalId } }); }
  resume(investmentIds: Types.ObjectId[]) { return this.investments.updateMany({ _id: { $in: investmentIds } }, { $set: { status: InvestmentStatus.ACTIVE }, $unset: { pendingWithdrawalId: 1 } }); }
  close(investmentIds: Types.ObjectId[]) { return this.investments.updateMany({ _id: { $in: investmentIds } }, { $set: { status: InvestmentStatus.CLOSED, remainingPrincipal: 0, closedAt: new Date() } }); }
  private round(value: number) { return Math.round(value * 100) / 100; }
}
