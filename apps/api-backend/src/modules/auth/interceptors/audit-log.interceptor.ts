import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditAction, UserRole } from '@tq-platform/types';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, body, ip, headers } = request;

    // Only audit log operations performed by STAFF, ADMIN, SUPER_ADMIN
    const isStaffOrAdmin = user && [UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role);

    return next.handle().pipe(
      tap(async (responseData) => {
        if (isStaffOrAdmin && method !== 'GET') {
          try {
            let action = AuditAction.UPDATE;
            if (method === 'POST') action = AuditAction.CREATE;
            if (method === 'DELETE') action = AuditAction.DELETE;

            await this.auditService.createAuditLog({
              operatorId: user.sub || user.userId || user.id,
              targetUserId: body?.targetUserId || body?.userId || null,
              action,
              resource: url,
              ipAddress: ip || headers['x-forwarded-for'] || '127.0.0.1',
              userAgent: headers['user-agent'] || 'Unknown',
              oldValues: body?.oldValues ? body.oldValues : null,
              newValues: responseData ? (typeof responseData === 'object' ? responseData : { result: responseData }) : null,
            });
          } catch (error) {
            console.error('[ERROR][audit-log.interceptor.ts - intercept]:', error);
          }
        }
      }),
    );
  }
}
