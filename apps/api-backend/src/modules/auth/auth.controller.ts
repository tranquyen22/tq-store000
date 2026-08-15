import { Controller, Post, Body, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto, ApprovePasswordResetDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';
import { UserRole } from '@tq-platform/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      console.error('[ERROR][auth.controller.ts - register]:', error);
      throw error;
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.authService.login(dto);
    } catch (error) {
      console.error('[ERROR][auth.controller.ts - login]:', error);
      throw error;
    }
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    try {
      return await this.authService.requestPasswordReset(dto);
    } catch (error) {
      console.error('[ERROR][auth.controller.ts - requestPasswordReset]:', error);
      throw error;
    }
  }

  @Post('approve-password-reset')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @UseInterceptors(AuditLogInterceptor)
  async approvePasswordReset(@Body() dto: ApprovePasswordResetDto, @CurrentUser('sub') operatorId: string) {
    try {
      return await this.authService.approvePasswordReset(dto.targetUserId, operatorId);
    } catch (error) {
      console.error('[ERROR][auth.controller.ts - approvePasswordReset]:', error);
      throw error;
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return { success: true, user };
  }
}
