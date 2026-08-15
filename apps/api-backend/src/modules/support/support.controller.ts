import { Controller, Post, Body, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ReviewsService } from './reviews.service';
import { TicketsService } from './tickets.service';
import { SendMessageDto, CreateConversationDto } from './dto/send-message.dto';
import { CreateReviewDto, GenerateAISyntheticReviewDto } from './dto/create-review.dto';
import { CreateTicketDisputeDto, ResolveDisputeRefundDto } from './dto/ticket-dispute.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditLogInterceptor } from '../auth/interceptors/audit-log.interceptor';
import { UserRole } from '@tq-platform/types';

@Controller('support')
export class SupportController {
  constructor(
    private readonly chatService: ChatService,
    private readonly reviewsService: ReviewsService,
    private readonly ticketsService: TicketsService
  ) {}

  @Post('chat/conversation')
  @UseGuards(JwtAuthGuard)
  async getOrCreateConversation(@Body() dto: CreateConversationDto, @CurrentUser('sub') userId: string) {
    return await this.chatService.getOrCreateConversation(userId, dto);
  }

  @Post('chat/send')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Body() dto: SendMessageDto, @CurrentUser('sub') userId: string) {
    return await this.chatService.sendMessage(userId, dto);
  }

  @Get('chat/messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Query('conversationId') conversationId: string) {
    return await this.chatService.getMessages(conversationId);
  }

  @Post('reviews/create')
  @UseGuards(JwtAuthGuard)
  async createReview(@Body() dto: CreateReviewDto, @CurrentUser('sub') userId: string) {
    return await this.reviewsService.createReview(userId, dto);
  }

  @Post('reviews/generate-ai-synthetic')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @UseInterceptors(AuditLogInterceptor)
  async generateAISyntheticReviews(@Body() dto: GenerateAISyntheticReviewDto) {
    return await this.reviewsService.generateAISyntheticReviews(dto);
  }

  @Post('tickets/dispute/create')
  @UseGuards(JwtAuthGuard)
  async createTicketDispute(@Body() dto: CreateTicketDisputeDto, @CurrentUser('sub') userId: string) {
    return await this.ticketsService.createTicketDispute(userId, dto);
  }

  @Post('tickets/dispute/resolve-refund')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @RequirePermissions('RESOLVE_DISPUTE')
  @UseInterceptors(AuditLogInterceptor)
  async resolveDisputeRefund(@Body() dto: ResolveDisputeRefundDto, @CurrentUser('sub') staffId: string) {
    return await this.ticketsService.resolveDisputeRefund(staffId, dto);
  }
}
