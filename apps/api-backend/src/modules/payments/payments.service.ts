import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma } from '@tq-platform/database';
import { WalletType, TransactionType } from '@tq-platform/types';
import { RequestDepositDto } from './dto/deposit.dto';
import { RequestWithdrawalDto } from './dto/withdraw.dto';

@Injectable()
export class PaymentsService {
  /**
    1. Luồng nạp tiền VietQR: Sinh mã VietQR & mã tham chiếu duy nhất TQDEP_<userId>_<time>
   */
  async requestDeposit(userId: string, dto: RequestDepositDto) {
    try {
      const referenceCode = `TQDEP_${userId.slice(0, 8)}_${Date.now()}`;
      const qrUrl = `https://img.vietqr.io/image/MB-123456789-compact2.png?amount=${dto.amount}&addInfo=${referenceCode}&accountName=CONG%20TY%20TQ%20PLATFORM`;

      return {
        success: true,
        message: 'Đã tạo yêu cầu nạp tiền VietQR. Vui lòng chuyển khoản đúng số tiền và nội dung.',
        referenceCode,
        amount: dto.amount,
        vietQrUrl: qrUrl,
        bankInfo: {
          bankName: 'Ngân hàng MBBank',
          accountNo: '123456789',
          accountName: 'CONG TY TQ PLATFORM'
        }
      };
    } catch (error) {
      console.error('[ERROR][payments.service.ts - requestDeposit]:', error);
      throw error;
    }
  }

  /**
    2. Phê duyệt Nạp tiền (Super Admin) - Atomic Database Transaction (ACID)
   */
  async approveDeposit(userId: string, referenceCode: string, amount: number) {
    try {
      return await prisma.$transaction(async (tx) => {
        let wallet = await tx.wallet.findFirst({
          where: { userId, walletType: WalletType.CUSTOMER_WALLET }
        });

        if (!wallet) {
          wallet = await tx.wallet.create({
            data: { userId, walletType: WalletType.CUSTOMER_WALLET, balance: 0 }
          });
        }

        // Increment wallet balance atomically
        const updatedWallet = await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: amount } }
        });

        // Record double-entry transaction
        const transaction = await tx.walletTransaction.create({
          data: {
            debitWalletId: wallet.id,
            creditWalletId: wallet.id,
            amount,
            type: TransactionType.DEPOSIT,
            referenceId: referenceCode,
            description: `Nạp tiền VietQR thành công (${referenceCode})`,
          }
        });

        return {
          success: true,
          message: 'Đã phê duyệt cộng số dư ví thành công',
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
    3. Luồng Rút tiền: Khóa số dư tức thì bằng DB Transaction chống Rút tiền kép (Double Spending)
   */
  async requestWithdrawal(userId: string, dto: RequestWithdrawalDto) {
    try {
      return await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findFirst({
          where: { userId, walletType: WalletType.CUSTOMER_WALLET }
        });

        if (!wallet || Number(wallet.balance) < dto.amount) {
          throw new BadRequestException('Số dư ví không đủ để thực hiện lệnh rút tiền này');
        }

        // Lock balance immediately (decrement atomically)
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: dto.amount } }
        });

        // Create transaction record
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
          message: 'Đã nhận yêu cầu rút tiền & khóa số dư an toàn. Chờ Admin giải ngân.',
          transactionId: transaction.id,
          amountLocked: dto.amount
        };
      });
    } catch (error) {
      console.error('[ERROR][payments.service.ts - requestWithdrawal]:', error);
      throw error;
    }
  }

  async getWalletBalance(userId: string) {
    try {
      const wallet = await prisma.wallet.findFirst({
        where: { userId, walletType: WalletType.CUSTOMER_WALLET }
      });
      return { success: true, balance: wallet ? Number(wallet.balance) : 0 };
    } catch (error) {
      console.error('[ERROR][payments.service.ts - getWalletBalance]:', error);
      return { success: false, balance: 0 };
    }
  }
}
