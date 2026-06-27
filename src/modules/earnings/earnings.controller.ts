import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { EarningsService } from './earnings.service';

@UseGuards(JwtAuthGuard)
@Controller('earnings')
export class EarningsController {
  constructor(private readonly earnings: EarningsService) {}
  @Get() list(@CurrentUser() user: { sub: string }) { return this.earnings.listForUser(user.sub); }
}
