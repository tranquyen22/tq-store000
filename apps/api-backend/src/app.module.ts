import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AuditService } from './modules/audit/audit.service';

@Module({
  imports: [AuthModule, DispatchModule, PaymentsModule],
  providers: [AuditService],
})
export class AppModule {}
