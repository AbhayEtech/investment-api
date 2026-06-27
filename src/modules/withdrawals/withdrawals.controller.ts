import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsArray, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Roles } from '../../common/constants';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { RequireRoles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { WithdrawalsService } from './withdrawals.service';

class RequestWithdrawalDto { @IsNumber() @Min(0) principalAmount!: number; @IsNumber() @Min(0) earningsAmount!: number; @IsOptional() @IsArray() investmentIds?: string[]; }
class ReviewDto { @IsIn(['APPROVE', 'REJECT']) action!: 'APPROVE' | 'REJECT'; @IsOptional() @IsString() adminNote?: string; }

@UseGuards(JwtAuthGuard)
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawals: WithdrawalsService) {}
  @Post() request(@CurrentUser() user: { sub: string }, @Body() dto: RequestWithdrawalDto) { return this.withdrawals.request(user.sub, dto); }
  @Get() list(@CurrentUser() user: { sub: string }) { return this.withdrawals.listForUser(user.sub); }
  @UseGuards(RolesGuard) @RequireRoles(Roles.SUPER_ADMIN) @Patch(':id/review') review(@CurrentUser() user: { sub: string }, @Param('id') id: string, @Body() dto: ReviewDto) { return this.withdrawals.review(user.sub, id, dto.action, dto.adminNote); }
}
