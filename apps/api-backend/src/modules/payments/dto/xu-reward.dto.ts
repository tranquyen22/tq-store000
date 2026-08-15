import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum XuActionType {
  PRODUCT_REVIEW_WITH_IMAGE = 'PRODUCT_REVIEW_WITH_IMAGE',
  WATCH_PROMO_VIDEO = 'WATCH_PROMO_VIDEO',
  DAILY_CHECKIN = 'DAILY_CHECKIN',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
}

export class RewardXuDto {
  @IsNotEmpty({ message: 'Loại hành vi thưởng xu' })
  @IsEnum(XuActionType)
  actionType: XuActionType;

  @IsOptional()
  @IsString()
  referenceId?: string;
}
