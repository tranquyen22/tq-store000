import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class RequestDepositDto {
  @IsNotEmpty({ message: 'Số tiền nạp không được để trống' })
  @IsNumber({}, { message: 'Số tiền nạp phải là dạng số' })
  @Min(10000, { message: 'Số tiền nạp tối thiểu là 10.000 VNĐ' })
  amount: number;
}

export class ApproveDepositDto {
  @IsNotEmpty({ message: 'Mã người dùng nạp tiền' })
  @IsString()
  targetUserId: string;

  @IsNotEmpty({ message: 'Mã tham chiếu giao dịch VietQR' })
  @IsString()
  transactionId: string;

  @IsNotEmpty({ message: 'Số tiền nạp được duyệt' })
  @IsNumber()
  amount: number;
}
