import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsNumber, IsString, Min } from 'class-validator';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { InvestmentsService } from '../investments/investments.service';
import { PaymentsService } from './payments.service';

class CreateOrderDto { @IsNumber() @Min(100) amount!: number; }
class VerifyDto { @IsString() razorpayOrderId!: string; @IsString() razorpayPaymentId!: string; @IsString() razorpaySignature!: string; @IsNumber() @Min(100) amount!: number; }

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService, private readonly investments: InvestmentsService) {}
  @Post('razorpay/order') order(@CurrentUser() user: { sub: string }, @Body() dto: CreateOrderDto) { return this.payments.createOrder(dto.amount, user.sub); }
  @Post('razorpay/verify') verify(@CurrentUser() user: { sub: string }, @Body() dto: VerifyDto) { this.payments.verify(dto.razorpayOrderId, dto.razorpayPaymentId, dto.razorpaySignature); return this.investments.createAfterPayment(user.sub, dto.amount, dto.razorpayPaymentId); }
}
