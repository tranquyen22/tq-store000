import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserRole } from '@tq-platform/types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Chưa xác thực người dùng');
    }

    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
      return true;
    }

    const userPermissions: string[] = user.permissions || [];
    const hasAllPermissions = requiredPermissions.every(p => userPermissions.includes(p));

    if (!hasAllPermissions) {
      throw new ForbiddenException(`Tài khoản nhân viên thiếu quyền: ${requiredPermissions.join(', ')}`);
    }

    return true;
  }
}
