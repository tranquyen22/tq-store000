import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { ChatService } from './chat.service';
import { ReviewsService } from './reviews.service';
import { TicketsService } from './tickets.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SupportController],
  providers: [ChatService, ReviewsService, TicketsService],
  exports: [ChatService, ReviewsService, TicketsService],
})
export class SupportModule {}
