import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@tq-platform/database';
import { WalletType, TransactionType } from '@tq-platform/types';

@Injectable()
export class DriverWalletService {
  /**
    Xử lý cộng thu nhập chuyến online hoặc trừ chiết khấu sàn khi khách trả tiền mặt (COD)
   */
  async processRideCommissionAndEarnings(params: {
    driverUserId: string;
    rideId: string;
    fareAmount: number;
    paymentMethod: 'COD' | 'TQ_WALLET' | 'MOMO_QR';
    commissionRate?: number; // 20% chiết khấu sàn mặc định
  }) {
    const { driverUserId, rideId, fareAmount, paymentMethod, commissionRate = 0.2 } = params;
    const commissionAmount = fareAmount * commissionRate;
    const netEarnings = fareAmount - commissionAmount;

    try {
      return await prisma.$transaction(async (tx) => {
        // Fetch or create Driver Earnings Wallet & Deposit Wallet
        let earningsWallet = await tx.wallet.findFirst({
          where: { userId: driverUserId, walletType: WalletType.DRIVER_WALLET }
        });
        if (!earningsWallet) {
          earningsWallet = await tx.wallet.create({
            data: { userId: driverUserId, walletType: WalletType.DRIVER_WALLET, balance: 0 }
          });
        }

        let depositWallet = await tx.wallet.findFirst({
          where: { userId: driverUserId, walletType: WalletType.CUSTOMER_WALLET } // Shared deposit ledger
        });
        if (!depositWallet) {
          depositWallet = await tx.wallet.create({
            data: { userId: driverUserId, walletType: WalletType.CUSTOMER_WALLET, balance: 500000 }
          });
        }

        // Platform Commission Wallet Singleton
        let platformWallet = await tx.wallet.findFirst({
          where: { walletType: WalletType.PLATFORM_COMMISSION_WALLET }
        });

        if (paymentMethod === 'COD') {
          // Khách trả tiền mặt: Trừ chiết khấu sàn trực tiếp vào Ví Ký quỹ của tài xế
          if (Number(depositWallet.balance) < commissionAmount) {
            throw new BadRequestException('Ví ký quỹ tài xế không đủ để trừ chiết khấu sàn');
          }

          await tx.wallet.update({
            where: { id: depositWallet.id },
            data: { balance: { decrement: commissionAmount } }
          });

          await tx.walletTransaction.create({
            data: {
              debitWalletId: depositWallet.id,
              creditWalletId: platformWallet ? platformWallet.id : depositWallet.id,
              amount: commissionAmount,
              type: TransactionType.COMMISSION_DEDUCTION,
              referenceId: rideId,
              description: `Trừ chiết khấu sàn 20% cuốc xe COD (${rideId})`,
            }
          });

          return { success: true, mode: 'COD', commissionDeducted: commissionAmount };

        } else {
          // Khách trả Online: Cộng số tiền thực nhận (Net Earnings) vào Ví Thu nhập của tài xế
          await tx.wallet.update({
            where: { id: earningsWallet.id },
            data: { balance: { increment: netEarnings } }
          });

          await tx.walletTransaction.create({
            data: {
              debitWalletId: earningsWallet.id,
              creditWalletId: earningsWallet.id,
              amount: netEarnings,
              type: TransactionType.RIDE_PAYMENT,
              referenceId: rideId,
              description: `Cộng thu nhập thực nhận cuốc online (${rideId})`,
            }
          });

          return { success: true, mode: 'ONLINE', netEarningsAdded: netEarnings };
        }
      });
    } catch (error) {
      console.error('[ERROR][driver-wallet.service.ts - processRideCommissionAndEarnings]:', error);
      throw error;
    }
  }
}
