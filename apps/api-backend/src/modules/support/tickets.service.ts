import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@tq-platform/database';
import { TicketStatus, WalletType, TransactionType } from '@tq-platform/types';
import { CreateTicketDisputeDto, ResolveDisputeRefundDto } from './dto/ticket-dispute.dto';

@Injectable()
export class TicketsService {
  /**
    1. Tiếp nhận khiếu nại (Giao thiếu món, hàng hỏng, tài xế không đến, tính sai cước, hàng giả)
   */
  async createTicketDispute(userId: string, dto: CreateTicketDisputeDto) {
    try {
      const ticket = await prisma.ticket.create({
        data: {
          userId,
          subject: `[DISPUTE - KHIẾU NẠI] ${dto.subject}`,
          description: `${dto.description} (Đơn: ${dto.orderId || 'N/A'})`,
          status: TicketStatus.OPEN
        }
      });

      return {
        success: true,
        message: 'Đã tiếp nhận ticket khiếu nại thành công.',
        ticketId: ticket.id
      };
    } catch (error) {
      console.error('[ERROR][tickets.service.ts - createTicketDispute]:', error);
      throw error;
    }
  }

  /**
    2. Trung tâm Khiếu nại (Dispute Center) - Tự động Refund về Ví TQ Pay & Ghi sổ
   */
  async resolveDisputeRefund(staffId: string, dto: ResolveDisputeRefundDto) {
    try {
      return await prisma.$transaction(async (tx) => {
        const ticket = await tx.ticket.findUnique({ where: { id: dto.ticketId } });
        if (!ticket) throw new NotFoundException('Không tìm thấy ticket khiếu nại');

        await tx.ticket.update({
          where: { id: dto.ticketId },
          data: {
            status: TicketStatus.RESOLVED,
            description: `${ticket.description}\n\n[REFUND CSKH - NV ${staffId}]: ${dto.resolutionNotes} (Hoàn: ${dto.refundAmount} VNĐ)`
          }
        });

        let customerWallet = await tx.wallet.findFirst({
          where: { userId: dto.customerId, walletType: WalletType.CUSTOMER_WALLET }
        });

        if (!customerWallet) {
          customerWallet = await tx.wallet.create({
            data: { userId: dto.customerId, walletType: WalletType.CUSTOMER_WALLET, balance: 0 }
          });
        }

        const updatedWallet = await tx.wallet.update({
          where: { id: customerWallet.id },
          data: { balance: { increment: dto.refundAmount } }
        });

        const refundTxn = await tx.walletTransaction.create({
          data: {
            debitWalletId: customerWallet.id,
            creditWalletId: customerWallet.id,
            amount: dto.refundAmount,
            type: TransactionType.REFUND,
            referenceId: dto.ticketId,
            description: `Tự động Refund khiếu nại Ticket ${dto.ticketId} (${dto.resolutionNotes})`,
          }
        });

        return {
          success: true,
          message: `Đã Refund tự động ${dto.refundAmount} VNĐ về Ví TQ Pay của khách hàng.`,
          refundTransactionId: refundTxn.id,
          newCustomerBalance: updatedWallet.balance
        };
      });
    } catch (error) {
      console.error('[ERROR][tickets.service.ts - resolveDisputeRefund]:', error);
      throw error;
    }
  }

  /**
    3. Phân hệ Xử phạt Vi phạm (Cảnh cáo -> Trừ điểm uy tín -> Khóa sản phẩm -> Tạm ngưng/Khóa tài khoản)
   */
  async applyViolationPenalty(targetUserId: string, penaltyType: 'WARN' | 'DEDUCT_REPUTATION' | 'LOCK_PRODUCT' | 'SUSPEND_ACCOUNT', reason: string) {
    try {
      if (penaltyType === 'SUSPEND_ACCOUNT') {
        await prisma.user.update({
          where: { id: targetUserId },
          data: { isActive: false }
        });
      }

      return {
        success: true,
        message: `Đã áp dụng hình thức xử phạt ${penaltyType} đối với người dùng / shop!`,
        targetUserId,
        penaltyType,
        reason
      };
    } catch (error) {
      console.error('[ERROR][tickets.service.ts - applyViolationPenalty]:', error);
      throw error;
    }
  }
}
