import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId;
  @Prop({ type: String, required: true, index: true }) type!: string;
  @Prop({ type: Number, required: true }) amount!: number;
  @Prop({ type: String, required: true }) description!: string;
  @Prop({ type: String }) referenceId?: string;
  @Prop({ type: Object }) metadata?: Record<string, unknown>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
