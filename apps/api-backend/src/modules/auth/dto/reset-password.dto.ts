import { IsNotEmpty, IsString } from 'class-validator';

export class RequestResetPasswordDto {
  @IsNotEmpty({ message: 'Số điện thoại hoặc Email tài khoản' })
  @IsString()
  phoneOrEmail: string;
}

export class ApproveResetPasswordDto {
  @IsNotEmpty({ message: 'Mã người dùng cần cấp lại mật khẩu' })
  @IsString()
  userId: string;
}
