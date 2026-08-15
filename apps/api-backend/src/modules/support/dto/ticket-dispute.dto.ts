import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTicketDisputeDto {
  @IsNotEmpty({ message: 'Tiêu đề khiếu nại (Giao thiếu món, hàng giả, sai tiền...)' })
  @IsString()
  subject: string;

  @IsNotEmpty({ message: 'Mô tả chi tiết sự cố' })
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  orderId?: string;
}

export class ResolveDisputeRefundDto {
  @IsNotEmpty({ message: 'Mã ticket khiếu nại' })
  @IsString()
  ticketId: string;

  @IsNotEmpty({ message: 'Mã khách hàng được refund' })
  @IsString()
  customerId: string;

  @IsNotEmpty({ message: 'Số tiền refund hoàn lại ví TQ Pay' })
  @IsNumber()
  @Min(1000)
  refundAmount: number;

  @IsNotEmpty({ message: 'Quyết định & lý do giải quyết của Nhân viên' })
  @IsString()
  resolutionNotes: string;
}
