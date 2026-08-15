import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@tq-platform/database';
import { TicketStatus, WalletType, TransactionType } from '@tq-platform/types';
import { CreateTicketDisputeDto, ResolveDisputeRefundDto } from './dto/ticket-dispute.dto';

@Injectable()
export class TicketsService {
  /**
    1. Tiếp nhận khiếu nại (Giao thiếu món, tính sai tiền, đồ cho thuê lỗi...)
   */
  async createTicketDispute(userId: string, dto: CreateTicketDisputeDto) {
    try {
      const ticket = await prisma.ticket.create({
        data: {
          userId,
          subject: `[DISPUTE - KHIẾU NẠI] ${dto.subject}`,
          description: `${dto.description} (Mã đơn liên quan: ${dto.orderId || 'Không có'})`,
          status: TicketStatus.OPEN
        }
      });

      return {
        success: true,
        message: 'Đã tiếp nhận ticket khiếu nại thành công. Bộ phận CSKH sẽ kiểm tra xử lý sớm nhất.',
        ticketId: ticket.id
      };
    } catch (error) {
      console.error('[ERROR][tickets.service.ts - createTicketDispute]:', error);
      throw error;
    }
  }

  /**
    2. Trung tâm Khiếu nại (Dispute Center) - Nhân viên duyệt & Tự động Refund về Ví TQ Pay khách hàng
   */
  async resolveDisputeRefund(staffId: string, dto: ResolveDisputeRefundDto) {
    try {
      return await prisma.$transaction(async (tx) => {
        const ticket = await tx.ticket.findUnique({ where: { id: dto.ticketId } });
        if (!ticket) throw new NotFoundException('Không tìm thấy ticket khiếu nại');

        // Update Ticket Status to RESOLVED
        await tx.ticket.update({
          where: { id: dto.ticketId },
          data: {
            status: TicketStatus.RESOLVED,
            description: `${ticket.description}\n\n[QUYẾT ĐỊNH GIẢI QUYẾT CSKH - Nhân viên ${staffId}]: ${dto.resolutionNotes} (Hoàn tiền: ${dto.refundAmount} VNĐ)`
          }
        });

        // Find or create Customer Wallet
        let customerWallet = await tx.wallet.findFirst({
          where: { userId: dto.customerId, walletType: WalletType.CUSTOMER_WALLET }
        });

        if (!customerWallet) {
          customerWallet = await tx.wallet.create({
            data: { userId: dto.customerId, walletType: WalletType.CUSTOMER_WALLET, balance: 0 }
          });
        }

        // Increment customer balance automatically (Refund)
        const updatedWallet = await tx.wallet.update({
          where: { id: customerWallet.id },
          data: { balance: { increment: dto.refundAmount } }
        });

        // Record double-entry transaction
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
          message: `Đã xử lý xong khiếu nại & Refund tự động ${dto.refundAmount} VNĐ về Ví TQ Pay của khách hàng.`,
          refundTransactionId: refundTxn.id,
          newCustomerBalance: updatedWallet.balance
        };
      });
    } catch (error) {
      console.error('[ERROR][tickets.service.ts - resolveDisputeRefund]:', error);
      throw error;
    }
  }
}
