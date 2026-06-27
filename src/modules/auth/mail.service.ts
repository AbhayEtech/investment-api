import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  constructor(private readonly config: ConfigService) { this.resend = new Resend(config.get<string>('RESEND_API_KEY')); }
  sendVerification(email: string, token: string) {
    const link = `${this.config.get('APP_URL')}/verify-email?token=${token}`;
    return this.resend.emails.send({ from: this.config.getOrThrow<string>('MAIL_FROM'), to: email, subject: 'Verify your investment account', html: `<p>Verify your email to activate your account.</p><p><a href="${link}">Verify email</a></p>` });
  }
  sendPasswordReset(email: string, token: string) {
    const link = `${this.config.get('APP_URL')}/reset-password?token=${token}`;
    return this.resend.emails.send({ from: this.config.getOrThrow<string>('MAIL_FROM'), to: email, subject: 'Reset your investment account password', html: `<p>Use the secure link below to reset your password.</p><p><a href="${link}">Reset password</a></p>` });
  }
}
