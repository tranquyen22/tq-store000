import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '@tq-platform/database';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestResetPasswordDto, ApproveResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    try {
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email: dto.email }, { phone: dto.phone }] }
      });
      if (existingUser) {
        throw new BadRequestException('Email hoặc Số điện thoại này đã tồn tại trong hệ thống');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = await prisma.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email,
          phone: dto.phone,
          passwordHash,
          role: dto.role
        }
      });

      const token = this.generateToken(user);
      return { success: true, message: 'Đăng ký tài khoản thành công', user, accessToken: token };
    } catch (error) {
      console.error('[ERROR][auth.service.ts - register]:', error);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: dto.phoneOrEmail }, { phone: dto.phoneOrEmail }] },
        include: { staffPerms: true }
      });
      if (!user) {
        throw new UnauthorizedException('Số điện thoại/Email hoặc mật khẩu không chính xác');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Số điện thoại/Email hoặc mật khẩu không chính xác');
      }

      const permissions = user.staffPerms.map(p => p.permission);
      const token = this.generateToken(user, permissions);

      return {
        success: true,
        message: 'Đăng nhập thành công',
        user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
        accessToken: token
      };
    } catch (error) {
      console.error('[ERROR][auth.service.ts - login]:', error);
      throw error;
    }
  }

  async requestPasswordReset(dto: RequestResetPasswordDto) {
    try {
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: dto.phoneOrEmail }, { phone: dto.phoneOrEmail }] }
      });
      if (!user) throw new NotFoundException('Không tìm thấy tài khoản hợp lệ');

      const ticket = await prisma.ticket.create({
        data: {
          userId: user.id,
          subject: '[RESET_PASSWORD] Yêu cầu cấp lại mật khẩu',
          description: `Tài khoản ${user.email} (${user.phone}) yêu cầu reset mật khẩu vào danh sách chờ Admin duyệt.`,
          status: 'OPEN'
        }
      });

      return {
        success: true,
        message: 'Đã gửi yêu cầu cấp lại mật khẩu. Vui lòng chờ Super Admin phê duyệt.',
        ticketId: ticket.id
      };
    } catch (error) {
      console.error('[ERROR][auth.service.ts - requestPasswordReset]:', error);
      throw error;
    }
  }

  async approvePasswordReset(dto: ApproveResetPasswordDto) {
    try {
      const user = await prisma.user.findUnique({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('Không tìm thấy tài khoản');

      const randomPassword = `TQ#${Math.floor(100000 + Math.random() * 900000)}`;
      const passwordHash = await bcrypt.hash(randomPassword, 10);

      await prisma.user.update({
        where: { id: dto.userId },
        data: { passwordHash }
      });

      return {
        success: true,
        message: 'Đã phê duyệt cấp lại mật khẩu mới ngẫu nhiên',
        userId: user.id,
        newRandomPassword: randomPassword
      };
    } catch (error) {
      console.error('[ERROR][auth.service.ts - approvePasswordReset]:', error);
      throw error;
    }
  }

  private generateToken(user: any, permissions: string[] = []) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions
    });
  }
}
