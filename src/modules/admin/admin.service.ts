import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvestmentStatus, TransactionType, WithdrawalStatus } from '../../common/constants';
import { Investment, InvestmentDocument } from '../../schemas/investment.schema';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { Withdrawal, WithdrawalDocument } from '../../schemas/withdrawal.schema';

@Injectable()
export class AdminService {
  constructor(@InjectModel(User.name) private readonly users: Model<UserDocument>, @InjectModel(Investment.name) private readonly investments: Model<InvestmentDocument>, @InjectModel(Withdrawal.name) private readonly withdrawals: Model<WithdrawalDocument>, @InjectModel(Transaction.name) private readonly transactions: Model<TransactionDocument>) {}
  async analytics() {
    const [totalUsers, totalActiveUsers, activeInvestors, pendingWithdrawRequests] = await Promise.all([this.users.countDocuments(), this.users.countDocuments({ active: true }), this.investments.distinct('userId', { status: InvestmentStatus.ACTIVE }).then((ids) => ids.length), this.withdrawals.countDocuments({ status: WithdrawalStatus.PENDING })]);
    const [investmentAgg, withdrawalAgg, gstAgg] = await Promise.all([this.investments.aggregate([{ $group: { _id: null, amount: { $sum: '$netInvestedAmount' }, count: { $sum: 1 } } }]), this.withdrawals.aggregate([{ $match: { status: WithdrawalStatus.COMPLETED } }, { $group: { _id: null, amount: { $sum: '$totalAmount' } } }]), this.transactions.aggregate([{ $match: { type: TransactionType.GST } }, { $group: { _id: null, amount: { $sum: '$amount' } } }])]);
    return { totalUsers, totalActiveUsers, activeInvestors, pendingWithdrawRequests, totalInvestments: investmentAgg[0]?.count ?? 0, totalInvestedAmount: investmentAgg[0]?.amount ?? 0, totalWithdrawals: withdrawalAgg[0]?.amount ?? 0, gstRevenue: gstAgg[0]?.amount ?? 0, platformRevenue: gstAgg[0]?.amount ?? 0 };
  }
}
