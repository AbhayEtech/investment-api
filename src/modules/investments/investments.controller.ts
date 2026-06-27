import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { InvestmentsService } from './investments.service';

@UseGuards(JwtAuthGuard)
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investments: InvestmentsService) {}
  @Get() list(@CurrentUser() user: { sub: string }) { return this.investments.listForUser(user.sub); }
}
