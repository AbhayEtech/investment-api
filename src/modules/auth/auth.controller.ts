import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';

class SignupDto { @IsString() @IsNotEmpty() fullName!: string; @IsEmail() email!: string; @IsString() @IsNotEmpty() mobileNumber!: string; @IsString() @MinLength(8) password!: string; }
class LoginDto { @IsEmail() email!: string; @IsString() password!: string; @IsOptional() @IsBoolean() rememberMe?: boolean; }
class EmailDto { @IsEmail() email!: string; }
class ResetDto { @IsString() token!: string; @IsString() @MinLength(8) password!: string; }

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('signup') signup(@Body() dto: SignupDto) { return this.auth.signup(dto); }
  @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto.email, dto.password, dto.rememberMe); }
  @Get('verify-email') verify(@Query('token') token: string) { return this.auth.verifyEmail(token); }
  @Post('forgot-password') forgot(@Body() dto: EmailDto) { return this.auth.forgotPassword(dto.email); }
  @Post('reset-password') reset(@Body() dto: ResetDto) { return this.auth.resetPassword(dto.token, dto.password); }
}
