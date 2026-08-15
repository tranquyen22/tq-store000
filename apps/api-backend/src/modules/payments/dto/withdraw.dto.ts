import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class RequestWithdrawalDto {
  @IsNotEmpty({ message: 'Số tiền rút không được để trống' })
  @IsNumber({}, { message: 'Số tiền rút phải là dạng số' })
  @Min(50000, { message: 'Số tiền rút tối thiểu là 50.000 VNĐ' })
  amount: number;

  @IsNotEmpty({ message: 'Tên ngân hàng nhận' })
  @IsString()
  bankName: string;

  @IsNotEmpty({ message: 'Số tài khoản ngân hàng' })
  @IsString()
  bankAccountNo: string;

  @IsNotEmpty({ message: 'Tên chủ tài khoản' })
  @IsString()
  bankAccountName: string;
}

export class ApproveWithdrawalDto {
  @IsNotEmpty({ message: 'Mã yêu cầu rút tiền' })
  @IsString()
  withdrawalId: string;
}
