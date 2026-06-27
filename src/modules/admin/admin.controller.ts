import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/constants';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { RequireRoles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { WithdrawalsService } from '../withdrawals/withdrawals.service';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles(Roles.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService, private readonly withdrawals: WithdrawalsService) {}
  @Get('analytics') analytics() { return this.admin.analytics(); }
  @Get('withdrawals/pending') pendingWithdrawals() { return this.withdrawals.listPending(); }
}
