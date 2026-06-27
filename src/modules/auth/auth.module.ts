import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailVerification, EmailVerificationSchema, PasswordReset, PasswordResetSchema } from '../../schemas/token.schema';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { MailService } from './mail.service';

@Module({ imports: [UsersModule, JwtModule.register({}), MongooseModule.forFeature([{ name: EmailVerification.name, schema: EmailVerificationSchema }, { name: PasswordReset.name, schema: PasswordResetSchema }])], controllers: [AuthController], providers: [AuthService, JwtStrategy, MailService], exports: [AuthService] })
export class AuthModule {}
