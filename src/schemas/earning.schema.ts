import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EarningDocument = HydratedDocument<Earning>;

@Schema({ timestamps: true })
export class Earning {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Investment', required: true, index: true }) investmentId!: Types.ObjectId;
  @Prop({ type: String, required: true }) earningDate!: string;
  @Prop({ type: Number, required: true }) amount!: number;
  @Prop({ type: Number, required: true }) baseAmount!: number;
  @Prop({ type: Number, required: true }) annualReturnRate!: number;
}

export const EarningSchema = SchemaFactory.createForClass(Earning);
EarningSchema.index({ investmentId: 1, earningDate: 1 }, { unique: true });
