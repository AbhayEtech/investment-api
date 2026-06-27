import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { WithdrawalStatus } from '../common/constants';

export type WithdrawalDocument = HydratedDocument<Withdrawal>;

@Schema({ timestamps: true })
export class Withdrawal {
  _id!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId;
  @Prop({ type: [Types.ObjectId], ref: 'Investment', default: [] }) investmentIds!: Types.ObjectId[];
  @Prop({ type: Number, required: true }) principalAmount!: number;
  @Prop({ type: Number, required: true }) earningsAmount!: number;
  @Prop({ type: Number, required: true }) totalAmount!: number;
  @Prop({ type: String, enum: Object.values(WithdrawalStatus), default: WithdrawalStatus.PENDING, index: true }) status!: string;
  @Prop({ type: Date, required: true }) requestedAt!: Date;
  @Prop({ type: Date, required: true }) expectedCompletionAt!: Date;
  @Prop({ type: Date }) reviewedAt?: Date;
  @Prop({ type: Types.ObjectId }) reviewedBy?: Types.ObjectId;
  @Prop({ type: String }) adminNote?: string;
}

export const WithdrawalSchema = SchemaFactory.createForClass(Withdrawal);
