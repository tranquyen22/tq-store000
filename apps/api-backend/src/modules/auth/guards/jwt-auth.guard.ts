import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Thiếu hoặc sai định dạng Token xác thực Authorization');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'tq_jwt_super_secret_key_2026',
      });
      request.user = payload;
      return true;
    } catch (error) {
      console.error('[ERROR][jwt-auth.guard.ts - canActivate]:', error);
      throw new UnauthorizedException('Token xác thực không hợp lệ hoặc đã hết hạn');
    }
  }
}
