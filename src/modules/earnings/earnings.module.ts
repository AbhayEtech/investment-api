import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Earning, EarningSchema } from '../../schemas/earning.schema';
import { InvestmentsModule } from '../investments/investments.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { EarningsController } from './earnings.controller';
import { EarningsService } from './earnings.service';

@Module({ imports: [MongooseModule.forFeature([{ name: Earning.name, schema: EarningSchema }]), InvestmentsModule, TransactionsModule, UsersModule], controllers: [EarningsController], providers: [EarningsService] })
export class EarningsModule {}
