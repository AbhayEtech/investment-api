import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto = require('crypto');
import Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay;
  constructor(private readonly config: ConfigService) { this.razorpay = new Razorpay({ key_id: config.getOrThrow<string>('RAZORPAY_KEY_ID'), key_secret: config.getOrThrow<string>('RAZORPAY_KEY_SECRET') }); }
  createOrder(amount: number, userId: string) {
    if (amount < 100) throw new BadRequestException('Minimum investment is INR 100');
    return this.razorpay.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt: `inv_${Date.now()}`, notes: { userId } });
  }
  verify(orderId: string, paymentId: string, signature: string) {
    const expected = crypto.createHmac('sha256', this.config.getOrThrow<string>('RAZORPAY_KEY_SECRET')).update(`${orderId}|${paymentId}`).digest('hex');
    if (expected !== signature) throw new BadRequestException('Invalid Razorpay signature');
  }
}
