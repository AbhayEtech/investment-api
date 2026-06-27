import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Investment, InvestmentSchema } from '../../schemas/investment.schema';
import { SettingsModule } from '../settings/settings.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';

@Module({ imports: [MongooseModule.forFeature([{ name: Investment.name, schema: InvestmentSchema }]), SettingsModule, TransactionsModule, UsersModule], controllers: [InvestmentsController], providers: [InvestmentsService], exports: [InvestmentsService, MongooseModule] })
export class InvestmentsModule {}
