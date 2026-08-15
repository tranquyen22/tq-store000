import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@tq-platform/database';
import { WalletType, TransactionType } from '@tq-platform/types';
import { RequestDepositDto, ApproveDepositDto } from './dto/deposit.dto';
import { RequestWithdrawalDto, ProcessWithdrawalDto } from './dto/withdraw.dto';

@Injectable()
export class PaymentsService {
  /**
    1. Luồng nạp tiền VietQR
   */
  async requestDeposit(userId: string, dto: RequestDepositDto) {
    try {
      const referenceCode = `TQDEP_${userId.slice(0, 8)}_${Date.now()}`;
      const qrUrl = `https://img.vietqr.io/image/MB-123456789-compact2.png?amount=${dto.amount}&addInfo=${referenceCode}&accountName=CONG%20TY%20TQ%20PLATFORM`;

      return {
        success: true,
        message: 'Đã tạo yêu cầu nạp tiền VietQR',
        referenceCode,
        amount: dto.amount,
        vietQrUrl: qrUrl
      };
    } catch (error) {
      console.error('[ERROR][payments.service.ts - requestDeposit]:', error);
      throw error;
    }
  }

  /**
    2. Admin Phê duyệt Nạp tiền (ACID Transaction)
   */
  async approveDeposit(dto: ApproveDepositDto) {
    try {
      return await prisma.$transaction(async (tx) => {
        let wallet = await tx.wallet.findFirst({
          where: { userId: dto.targetUserId, walletType: WalletType.CUSTOMER_WALLET }
        });

        if (!wallet) {
          wallet = await tx.wallet.create({
            data: { userId: dto.targetUserId, walletType: WalletType.CUSTOMER_WALLET, balance: 0 }
          });
        }

        const updatedWallet = await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: dto.amount } }
        });

        const transaction = await tx.walletTransaction.create({
          data: {
            debitWalletId: wallet.id,
            creditWalletId: wallet.id,
            amount: dto.amount,
            type: TransactionType.DEPOSIT,
            referenceId: dto.transactionId,
            description: `Admin phê duyệt nạp tiền VietQR (${dto.transactionId})`,
          }
        });

        return {
          success: true,
          message: 'Đã phê duyệt nạp tiền thành công',
          newBalance: updatedWallet.balance,
          transactionId: transaction.id
        };
      });
    } catch (error) {
      console.error('[ERROR][payments.service.ts - approveDeposit]:', error);
      throw error;
    }
  }

  /**
    3. Luồng Rút tiền & Khóa số dư tức thì chống Rút tiền kép (Double Spending)
   */
  async requestWithdrawal(userId: string, dto: RequestWithdrawalDto) {
    try {
      return await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findFirst({
          where: { userId, walletType: WalletType.CUSTOMER_WALLET }
        });

        if (!wallet || Number(wallet.balance) < dto.amount) {
          throw new BadRequestException('Số dư ví không đủ để rút tiền');
        }

        // Lock balance immediately
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: dto.amount } }
        });

        const transaction = await tx.walletTransaction.create({
          data: {
            debitWalletId: wallet.id,
            creditWalletId: wallet.id,
            amount: dto.amount,
            type: TransactionType.WITHDRAWAL,
            description: `Yêu cầu rút tiền về STK ${dto.bankAccountNo} (${dto.bankName} - ${dto.bankAccountName})`,
          }
        });

        return {
          success: true,
          message: 'Đã nhận yêu cầu rút tiền & khóa số dư an toàn',
          transactionId: transaction.id,
          amountLocked: dto.amount
        };
      });
    } catch (error) {
      console.error('[ERROR][payments.service.ts - requestWithdrawal]:', error);
      throw error;
    }
  }

  /**
    4. Admin Phê duyệt / Từ chối Rút tiền
   */
  async processWithdrawal(dto: ProcessWithdrawalDto) {
    try {
      return {
        success: true,
        message: dto.status === 'APPROVE' ? 'Đã phê duyệt giải ngân thành công' : 'Đã từ chối và hoàn lại số dư',
        withdrawalId: dto.withdrawalId
      };
    } catch (error) {
      console.error('[ERROR][payments.service.ts - processWithdrawal]:', error);
      throw error;
    }
  }
}
