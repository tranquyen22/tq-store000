import { Injectable } from '@nestjs/common';
import { prisma } from '@tq-platform/database';
import { AuditAction } from '@tq-platform/types';

export interface CreateAuditLogParams {
  operatorId: string;
  targetUserId?: string | null;
  action: AuditAction;
  resource: string;
  ipAddress?: string;
  userAgent?: string;
  oldValues?: any;
  newValues?: any;
}

@Injectable()
export class AuditService {
  async createAuditLog(params: CreateAuditLogParams) {
    try {
      return await prisma.auditLog.create({
        data: {
          operatorId: params.operatorId,
          targetUserId: params.targetUserId || null,
          action: params.action,
          resource: params.resource,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          oldValues: params.oldValues || undefined,
          newValues: params.newValues || undefined,
        },
      });
    } catch (error) {
      console.error('[ERROR][audit.service.ts - createAuditLog]:', error);
      return null;
    }
  }

  async getAuditLogs(operatorId?: string, limit = 50) {
    try {
      return await prisma.auditLog.findMany({
        where: operatorId ? { operatorId } : undefined,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          operator: { select: { fullName: true, email: true, role: true } },
          targetUser: { select: { fullName: true, email: true } },
        },
      });
    } catch (error) {
      console.error('[ERROR][audit.service.ts - getAuditLogs]:', error);
      return [];
    }
  }
}
