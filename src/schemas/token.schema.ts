import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EmailVerificationDocument = HydratedDocument<EmailVerification>;
export type PasswordResetDocument = HydratedDocument<PasswordReset>;

@Schema({ timestamps: true })
export class EmailVerification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId;
  @Prop({ type: String, required: true, unique: true }) token!: string;
  @Prop({ type: Date, required: true }) expiresAt!: Date;
  @Prop({ type: Date }) usedAt?: Date;
}

@Schema({ timestamps: true })
export class PasswordReset {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId;
  @Prop({ type: String, required: true, unique: true }) token!: string;
  @Prop({ type: Date, required: true }) expiresAt!: Date;
  @Prop({ type: Date }) usedAt?: Date;
}

export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);
export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);
