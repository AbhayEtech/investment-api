import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { InvestmentStatus } from '../common/constants';

export type InvestmentDocument = HydratedDocument<Investment>;

@Schema({ timestamps: true })
export class Investment {
  _id!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId;
  @Prop({ type: Number, required: true }) grossAmount!: number;
  @Prop({ type: Number, required: true }) gstDeducted!: number;
  @Prop({ type: Number, required: true }) netInvestedAmount!: number;
  @Prop({ type: Number, required: true }) remainingPrincipal!: number;
  @Prop({ type: Number, required: true }) annualReturnRate!: number;
  @Prop({ type: Number, required: true }) gstRate!: number;
  @Prop({ type: Number, required: true }) lockPeriodDays!: number;
  @Prop({ type: Date, required: true }) investmentDate!: Date;
  @Prop({ type: Date, required: true, index: true }) earningStartDate!: Date;
  @Prop({ type: String, enum: Object.values(InvestmentStatus), default: InvestmentStatus.ACTIVE, index: true }) status!: string;
  @Prop({ type: Types.ObjectId }) pendingWithdrawalId?: Types.ObjectId;
  @Prop({ type: Date }) closedAt?: Date;
}

export const InvestmentSchema = SchemaFactory.createForClass(Investment);
