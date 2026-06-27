import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingDocument = HydratedDocument<Setting>;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ type: String, default: 'default', unique: true }) key!: string;
  @Prop({ type: Number, default: 7 }) annualReturnRate!: number;
  @Prop({ type: Number, default: 0.5 }) gstRate!: number;
  @Prop({ type: Number, default: 3 }) lockPeriodDays!: number;
  @Prop({ type: Number, default: 4 }) withdrawalProcessingDays!: number;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
