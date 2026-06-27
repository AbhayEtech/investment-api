import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import dayjs = require('dayjs');
import { Model, Types } from 'mongoose';
import { TransactionType } from '../../common/constants';
import { Earning, EarningDocument } from '../../schemas/earning.schema';
import { InvestmentsService } from '../investments/investments.service';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class EarningsService {
  constructor(@InjectModel(Earning.name) private readonly earnings: Model<EarningDocument>, private readonly investments: InvestmentsService, private readonly users: UsersService, private readonly transactions: TransactionsService) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) runDailyCron() { return this.generateForDate(dayjs().format('YYYY-MM-DD')); }
  async generateForDate(earningDate: string) {
    const today = dayjs(earningDate).startOf('day').toDate();
    const investments = await this.investments.activeReadyForEarnings(today);
    let generated = 0;
    for (const investment of investments) {
      const amount = Math.round(((investment.remainingPrincipal * investment.annualReturnRate) / 100 / 365) * 10000) / 10000;
      try {
        const earning = await this.earnings.create({ userId: investment.userId, investmentId: investment._id, earningDate, amount, baseAmount: investment.remainingPrincipal, annualReturnRate: investment.annualReturnRate });
        await this.users.adjustWallets(investment.userId, 0, amount);
        await this.transactions.create({ userId: investment.userId, type: TransactionType.EARNING, amount, referenceId: earning.id, description: `Daily earning for ${earningDate}` });
        generated += 1;
      } catch (error: unknown) {
        if ((error as { code?: number }).code !== 11000) throw error;
      }
    }
    return { date: earningDate, generated };
  }
  listForUser(userId: string) { return this.earnings.find({ userId: new Types.ObjectId(userId) }).sort({ earningDate: -1 }).limit(365); }
}
