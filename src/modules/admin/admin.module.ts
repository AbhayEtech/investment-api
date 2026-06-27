import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Earning, EarningSchema } from '../../schemas/earning.schema';
import { Investment, InvestmentSchema } from '../../schemas/investment.schema';
import { Transaction, TransactionSchema } from '../../schemas/transaction.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { Withdrawal, WithdrawalSchema } from '../../schemas/withdrawal.schema';
import { WithdrawalsModule } from '../withdrawals/withdrawals.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({ imports: [WithdrawalsModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Investment.name, schema: InvestmentSchema }, { name: Withdrawal.name, schema: WithdrawalSchema }, { name: Transaction.name, schema: TransactionSchema }, { name: Earning.name, schema: EarningSchema }])], controllers: [AdminController], providers: [AdminService] })
export class AdminModule {}
