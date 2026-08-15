import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AuditService } from './modules/audit/audit.service';

@Module({
  imports: [AuthModule],
  providers: [AuditService],
})
export class AppModule {}
