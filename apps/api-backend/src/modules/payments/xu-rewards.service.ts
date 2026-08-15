import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@tq-platform/database';
import { RewardXuDto, XuActionType } from './dto/xu-reward.dto';

@Injectable()
export class XuRewardsService {
  /**
    Logic thưởng TQ Xu & lưu vết nhật ký xu_logs
   */
  async rewardXu(userId: string, dto: RewardXuDto) {
    try {
      let rewardAmount = 0;
      let description = '';

      switch (dto.actionType) {
        case XuActionType.PRODUCT_REVIEW_WITH_IMAGE:
          rewardAmount = 500;
          description = 'Thưởng 500 TQ Xu cho đánh giá sản phẩm có kèm hình ảnh thực tế';
          break;
        case XuActionType.WATCH_PROMO_VIDEO:
          rewardAmount = 100;
          description = 'Thưởng 100 TQ Xu cho việc xem video quảng cáo sản phẩm';
          break;
        case XuActionType.DAILY_CHECKIN:
          rewardAmount = 50;
          description = 'Thưởng 50 TQ Xu điểm danh hàng ngày';
          break;
        case XuActionType.ORDER_COMPLETED:
          rewardAmount = 200;
          description = 'Thưởng 200 TQ Xu hoàn tất đơn hàng thành công';
          break;
        default:
          throw new BadRequestException('Hành vi thưởng Xu không hợp lệ');
      }

      const lastLog = await prisma.xuLog.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      const currentBalance = lastLog ? lastLog.balance : 0;
      const newBalance = currentBalance + rewardAmount;

      const xuLog = await prisma.xuLog.create({
        data: {
          userId,
          amount: rewardAmount,
          balance: newBalance,
          description: `${description} (${dto.referenceId || 'N/A'})`,
        }
      });

      return {
        success: true,
        message: `Đã cộng ${rewardAmount} TQ Xu vào tài khoản!`,
        rewardAmount,
        totalXuBalance: newBalance,
        logId: xuLog.id
      };
    } catch (error) {
      console.error('[ERROR][xu-rewards.service.ts - rewardXu]:', error);
      throw error;
    }
  }

  async getXuLogs(userId: string) {
    try {
      return await prisma.xuLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30
      });
    } catch (error) {
      console.error('[ERROR][xu-rewards.service.ts - getXuLogs]:', error);
      return [];
    }
  }
}
