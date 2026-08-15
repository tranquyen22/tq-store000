import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { XuRewardsService } from './xu-rewards.service';
import { FinancialReportService } from './financial-report.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, XuRewardsService, FinancialReportService],
  exports: [PaymentsService, XuRewardsService, FinancialReportService],
})
export class PaymentsModule {}
