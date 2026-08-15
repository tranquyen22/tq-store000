import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SupportModule } from './modules/support/support.module';
import { AuditService } from './modules/audit/audit.service';

@Module({
  imports: [AuthModule, DispatchModule, PaymentsModule, SupportModule],
  providers: [AuditService],
})
export class AppModule {}
