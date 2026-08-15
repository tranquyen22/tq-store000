import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';
import { AuditService } from '../audit/audit.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tq_jwt_super_secret_key_2026',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuditService, JwtAuthGuard, RolesGuard, PermissionsGuard, AuditLogInterceptor],
  exports: [AuthService, JwtAuthGuard, RolesGuard, PermissionsGuard, AuditLogInterceptor, JwtModule],
})
export class AuthModule {}
