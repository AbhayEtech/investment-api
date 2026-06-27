import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import dayjs = require('dayjs');
import { Model } from 'mongoose';
import { Roles } from '../../common/constants';
import { EmailVerification, EmailVerificationDocument, PasswordReset, PasswordResetDocument } from '../../schemas/token.schema';
import { UsersService } from '../users/users.service';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService, private readonly config: ConfigService, private readonly mail: MailService, @InjectModel(EmailVerification.name) private readonly emailTokens: Model<EmailVerificationDocument>, @InjectModel(PasswordReset.name) private readonly resetTokens: Model<PasswordResetDocument>) {}
  async signup(input: { fullName: string; email: string; mobileNumber: string; password: string }) {
    if (await this.users.findByEmail(input.email)) throw new BadRequestException('Email already registered');
    const user = await this.users.create({ fullName: input.fullName, email: input.email.toLowerCase(), mobileNumber: input.mobileNumber, passwordHash: await bcrypt.hash(input.password, 12), role: Roles.USER });
    const token = randomUUID();
    await this.emailTokens.create({ userId: user._id, token, expiresAt: dayjs().add(24, 'hour').toDate() });
    await this.mail.sendVerification(user.email, token);
    return { message: 'Signup successful. Please verify your email.' };
  }
  async verifyEmail(token: string) {
    const record = await this.emailTokens.findOne({ token, usedAt: null, expiresAt: { $gt: new Date() } });
    if (!record) throw new BadRequestException('Invalid or expired verification token');
    await this.users.updateById(record.userId, { emailVerified: true });
    record.usedAt = new Date();
    await record.save();
    return { message: 'Email verified' };
  }
  async login(email: string, password: string, remember = false) {
    const user = await this.users.findByEmail(email, true);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new UnauthorizedException('Invalid credentials');
    if (!user.emailVerified) throw new UnauthorizedException('Please verify your email before logging in');
    if (!user.active) throw new UnauthorizedException('Account disabled');
    const tokens = await this.issueTokens(user.id, user.email, user.role, remember);
    await this.users.updateById(user._id, { refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 12) });
    return { user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }, ...tokens };
  }
  async forgotPassword(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return { message: 'If the account exists, a reset email has been sent.' };
    const token = randomUUID();
    await this.resetTokens.create({ userId: user._id, token, expiresAt: dayjs().add(1, 'hour').toDate() });
    await this.mail.sendPasswordReset(user.email, token);
    return { message: 'If the account exists, a reset email has been sent.' };
  }
  async resetPassword(token: string, password: string) {
    const record = await this.resetTokens.findOne({ token, usedAt: null, expiresAt: { $gt: new Date() } });
    if (!record) throw new BadRequestException('Invalid or expired reset token');
    await this.users.updateById(record.userId, { passwordHash: await bcrypt.hash(password, 12), refreshTokenHash: undefined });
    record.usedAt = new Date();
    await record.save();
    return { message: 'Password reset successful' };
  }
  private async issueTokens(sub: string, email: string, role: string, remember: boolean) {
    const payload = { sub, email, role };
    const accessTtl = (this.config.get<string>('JWT_ACCESS_TTL') ?? '15m') as never;
    const refreshTtl = (remember ? '60d' : this.config.get<string>('JWT_REFRESH_TTL') ?? '30d') as never;
    return { accessToken: await this.jwt.signAsync(payload, { secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'), expiresIn: accessTtl }), refreshToken: await this.jwt.signAsync(payload, { secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'), expiresIn: refreshTtl }) };
  }
}
