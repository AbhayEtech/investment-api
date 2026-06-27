import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Withdrawal, WithdrawalSchema } from '../../schemas/withdrawal.schema';
import { InvestmentsModule } from '../investments/investments.module';
import { SettingsModule } from '../settings/settings.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { WithdrawalsController } from './withdrawals.controller';
import { WithdrawalsService } from './withdrawals.service';

@Module({ imports: [MongooseModule.forFeature([{ name: Withdrawal.name, schema: WithdrawalSchema }]), InvestmentsModule, SettingsModule, TransactionsModule, UsersModule], controllers: [WithdrawalsController], providers: [WithdrawalsService], exports: [WithdrawalsService, MongooseModule] })
export class WithdrawalsModule {}
