import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { AuditService } from './modules/audit/audit.service';

@Module({
  imports: [AuthModule, DispatchModule],
  providers: [AuditService],
})
export class AppModule {}
