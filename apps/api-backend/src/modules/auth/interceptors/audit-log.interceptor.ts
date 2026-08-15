import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { prisma } from '@tq-platform/database';
import { UserRole } from '@tq-platform/types';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, ip } = request;

    return next.handle().pipe(
      tap(async (data) => {
        if (user && (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.EMPLOYEE)) {
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            try {
              await prisma.auditLog.create({
                data: {
                  operatorId: user.sub || user.id,
                  operatorRole: user.role,
                  action: method,
                  resource: url,
                  ipAddress: ip || '127.0.0.1',
                  newValues: JSON.stringify({ body, result: data })
                }
              });
            } catch (err) {
              console.error('[ERROR][audit-log.interceptor.ts]: Failed to record audit log', err);
            }
          }
        }
      })
    );
  }
}
