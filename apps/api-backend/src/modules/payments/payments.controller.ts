import { Controller, Post, Body, Get, UseGuards, UseInterceptors, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { PaymentsService } from './payments.service';
import { XuRewardsService } from './xu-rewards.service';
import { FinancialReportService } from './financial-report.service';
import { RequestDepositDto, ApproveDepositDto } from './dto/deposit.dto';
import { RequestWithdrawalDto } from './dto/withdraw.dto';
import { RewardXuDto } from './dto/xu-reward.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditLogInterceptor } from '../auth/interceptors/audit-log.interceptor';
import { UserRole } from '@tq-platform/types';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly xuRewardsService: XuRewardsService,
    private readonly financialReportService: FinancialReportService
  ) {}

  @Post('deposit/request')
  @UseGuards(JwtAuthGuard)
  async requestDeposit(@Body() dto: RequestDepositDto, @CurrentUser('sub') userId: string) {
    return await this.paymentsService.requestDeposit(userId, dto);
  }

  @Post('deposit/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @UseInterceptors(AuditLogInterceptor)
  async approveDeposit(@Body() dto: ApproveDepositDto & { targetUserId: string; amount: number }) {
    return await this.paymentsService.approveDeposit(dto.targetUserId, dto.transactionId, dto.amount);
  }

  @Post('withdraw/request')
  @UseGuards(JwtAuthGuard)
  async requestWithdrawal(@Body() dto: RequestWithdrawalDto, @CurrentUser('sub') userId: string) {
    return await this.paymentsService.requestWithdrawal(userId, dto);
  }

  @Post('xu/reward')
  @UseGuards(JwtAuthGuard)
  async rewardXu(@Body() dto: RewardXuDto, @CurrentUser('sub') userId: string) {
    return await this.xuRewardsService.rewardXu(userId, dto);
  }

  @Get('pnl-report')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async getPnLReport(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return await this.financialReportService.getProfitAndLossReport(startDate, endDate);
  }

  @Get('export-csv')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async exportCSV(@Res() res: Response) {
    const csvData = await this.financialReportService.exportFinancialReportCSV();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=tq_financial_report_${Date.now()}.csv`);
    return res.send('\uFEFF' + csvData); // UTF-8 BOM for Excel compatibility
  }
}
