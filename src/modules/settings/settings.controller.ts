import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Roles } from '../../common/constants';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { RequireRoles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { SettingsService } from './settings.service';

class UpdateSettingsDto {
  @IsOptional() @IsNumber() @Min(0) annualReturnRate?: number;
  @IsOptional() @IsNumber() @Min(0) gstRate?: number;
  @IsOptional() @IsNumber() @Min(0) lockPeriodDays?: number;
  @IsOptional() @IsNumber() @Min(1) withdrawalProcessingDays?: number;
}

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}
  @Get() current() { return this.settings.current(); }
  @UseGuards(JwtAuthGuard, RolesGuard) @RequireRoles(Roles.SUPER_ADMIN) @Patch() update(@Body() dto: UpdateSettingsDto) { return this.settings.update(dto); }
}
