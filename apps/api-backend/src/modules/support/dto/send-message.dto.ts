import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty({ message: 'Mã cuộc trò chuyện (Conversation)' })
  @IsString()
  conversationId: string;

  @IsNotEmpty({ message: 'Nội dung tin nhắn không được để trống' })
  @IsString()
  content: string;
}

export class CreateConversationDto {
  @IsNotEmpty({ message: 'Mã người nhận tin nhắn' })
  @IsString()
  recipientId: string;

  @IsOptional()
  @IsString()
  title?: string;
}
