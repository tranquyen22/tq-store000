import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '@tq-platform/database';
import { UserRole, WalletType } from '@tq-platform/types';
import { maskPhoneNumber } from '@tq-platform/utils';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    try {
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email: dto.email }, { phone: dto.phone }] }
      });
      if (existingUser) {
        throw new BadRequestException('Email hoặc Số điện thoại này đã được đăng ký!');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = await prisma.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email,
          phone: dto.phone,
          passwordHash,
          citizenId: dto.citizenId || null,
          role: dto.role || UserRole.CUSTOMER,
        }
      });

      // Initialize Customer Wallet
      await prisma.wallet.create({
        data: { userId: user.id, walletType: WalletType.CUSTOMER_WALLET, balance: 0 }
      });

      const tokens = await this.generateTokens(user.id, user.role, []);
      return { success: true, message: 'Đăng ký tài khoản mới thành công', user: this.sanitizeUser(user), ...tokens };
    } catch (error) {
      console.error('[ERROR][auth.service.ts - register]:', error);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: dto.identifier }, { phone: dto.identifier }] },
        include: { staffPermissions: true }
      });

      if (!user) {
        throw new UnauthorizedException('Số điện thoại/Email hoặc mật khẩu không chính xác');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Tài khoản của bạn đã bị khóa hoặc tạm ngưng');
      }

      const isPasswordMatch = await bcrypt.compare(dto.password, user.passwordHash);
      if (!isPasswordMatch) {
        throw new UnauthorizedException('Số điện thoại/Email hoặc mật khẩu không chính xác');
      }

      const permissions = user.staffPermissions.map(sp => sp.permission);
      const tokens = await this.generateTokens(user.id, user.role, permissions);

      return {
        success: true,
        message: 'Đăng nhập thành công',
        user: this.sanitizeUser(user),
        permissions,
        ...tokens
      };
    } catch (error) {
      console.error('[ERROR][auth.service.ts - login]:', error);
      throw error;
    }
  }

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    try {
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: dto.identifier }, { phone: dto.identifier }] }
      });
      if (!user) throw new NotFoundException('Không tìm thấy tài khoản hợp lệ');

      await prisma.ticket.create({
        data: {
          userId: user.id,
          subject: `[Yêu cầu Cấp lại Mật khẩu] - ${user.fullName}`,
          description: `Lý do: ${dto.reason}. SĐT: ${user.phone}`,
        }
      });

      return { success: true, message: 'Đã gửi yêu cầu cấp lại mật khẩu tới Super Admin. Hệ thống sẽ xử lý sớm nhất.' };
    } catch (error) {
      console.error('[ERROR][auth.service.ts - requestPasswordReset]:', error);
      throw error;
    }
  }

  async approvePasswordReset(targetUserId: string, operatorId: string) {
    try {
      const user = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!user) throw new NotFoundException('Không tìm thấy tài khoản người dùng');

      const randomPass = 'TQ@' + Math.floor(100000 + Math.random() * 900000);
      const newHash = await bcrypt.hash(randomPass, 10);

      await prisma.user.update({
        where: { id: targetUserId },
        data: { passwordHash: newHash }
      });

      return {
        success: true,
        message: `Đã cấp lại mật khẩu mới cho ${user.fullName}`,
        newTemporaryPassword: randomPass,
        maskedPhone: maskPhoneNumber(user.phone)
      };
    } catch (error) {
      console.error('[ERROR][auth.service.ts - approvePasswordReset]:', error);
      throw error;
    }
  }

  private async generateTokens(userId: string, role: UserRole, permissions: string[]) {
    const payload = { sub: userId, role, permissions };
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1d' });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, citizenId, ...rest } = user;
    return {
      ...rest,
      phone: maskPhoneNumber(user.phone),
    };
  }
}
