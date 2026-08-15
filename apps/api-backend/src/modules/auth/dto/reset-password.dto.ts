import { IsNotEmpty, IsString } from 'class-validator';

export class RequestPasswordResetDto {
  @IsNotEmpty({ message: 'Số điện thoại hoặc Email yêu cầu cấp lại mật khẩu không được để trống' })
  @IsString()
  identifier: string;

  @IsNotEmpty({ message: 'Lý do yêu cầu cấp lại mật khẩu' })
  @IsString()
  reason: string;
}

export class ApprovePasswordResetDto {
  @IsNotEmpty({ message: 'Mã người dùng yêu cầu' })
  @IsString()
  targetUserId: string;
}
