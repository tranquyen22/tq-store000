import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@tq-platform/database';
import { maskPhoneNumber } from '@tq-platform/utils';
import { SendMessageDto, CreateConversationDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  /**
    Tạo hoặc lấy cuộc trò chuyện giữa Khách hàng <-> Shop / Tài xế
   */
  async getOrCreateConversation(senderId: string, dto: CreateConversationDto) {
    try {
      let conversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            { users: { some: { id: senderId } } },
            { users: { some: { id: dto.recipientId } } }
          ]
        },
        include: { users: { select: { id: true, fullName: true, role: true } } }
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            title: dto.title || 'Trò chuyện TQ Platform',
            users: {
              connect: [{ id: senderId }, { id: dto.recipientId }]
            }
          },
          include: { users: { select: { id: true, fullName: true, role: true } } }
        });
      }

      return { success: true, conversation };
    } catch (error) {
      console.error('[ERROR][chat.service.ts - getOrCreateConversation]:', error);
      throw error;
    }
  }

  /**
    Gửi tin nhắn Realtime & Tự động che SĐT thật bảo mật PII
   */
  async sendMessage(senderId: string, dto: SendMessageDto) {
    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: dto.conversationId }
      });
      if (!conversation) throw new NotFoundException('Không tìm thấy cuộc trò chuyện hợp lệ');

      // PII Protection: Automatically detect & mask phone numbers in chat content
      const sanitizedContent = this.sanitizeChatMessageContent(dto.content);

      const message = await prisma.message.create({
        data: {
          conversationId: dto.conversationId,
          senderId,
          content: sanitizedContent
        },
        include: {
          sender: { select: { id: true, fullName: true, role: true } }
        }
      });

      return {
        success: true,
        message,
        piiMasked: sanitizedContent !== dto.content
      };
    } catch (error) {
      console.error('[ERROR][chat.service.ts - sendMessage]:', error);
      throw error;
    }
  }

  async getMessages(conversationId: string) {
    try {
      return await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: { select: { id: true, fullName: true, role: true } }
        }
      });
    } catch (error) {
      console.error('[ERROR][chat.service.ts - getMessages]:', error);
      return [];
    }
  }

  private sanitizeChatMessageContent(content: string): string {
    // Regex matching Vietnamese phone numbers (e.g. 0987654321, 0912345678)
    const phoneRegex = /(0[3|5|7|8|9]\d{8})/g;
    return content.replace(phoneRegex, (match) => maskPhoneNumber(match));
  }
}
