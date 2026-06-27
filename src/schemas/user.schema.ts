import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role, Roles } from '../common/constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id!: Types.ObjectId;
  @Prop({ type: String, required: true, trim: true }) fullName!: string;
  @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true }) email!: string;
  @Prop({ type: String, required: true, trim: true }) mobileNumber!: string;
  @Prop({ type: String, required: true, select: false }) passwordHash!: string;
  @Prop({ type: String, enum: Object.values(Roles), default: Roles.USER }) role!: Role;
  @Prop({ type: Boolean, default: false }) emailVerified!: boolean;
  @Prop({ type: Boolean, default: true }) active!: boolean;
  @Prop({ type: Number, default: 0 }) investmentWallet!: number;
  @Prop({ type: Number, default: 0 }) earningsWallet!: number;
  @Prop({ type: Number, default: 0 }) totalWithdrawn!: number;
  @Prop({ type: String }) refreshTokenHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
