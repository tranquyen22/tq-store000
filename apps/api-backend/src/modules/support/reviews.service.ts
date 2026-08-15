import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@tq-platform/database';
import { CreateReviewDto, GenerateAISyntheticReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  /**
    1. Đánh giá sản phẩm đa chiều (1-5 sao, bình luận & hình ảnh)
   */
  async createReview(userId: string, dto: CreateReviewDto) {
    try {
      const product = await prisma.product.findUnique({ where: { id: dto.productId } });
      if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

      const review = await prisma.review.create({
        data: {
          userId,
          productId: dto.productId,
          rating: dto.rating,
          comment: dto.comment || null,
        }
      });

      // Recalculate average rating & reviews count
      const allReviews = await prisma.review.findMany({ where: { productId: dto.productId } });
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await prisma.product.update({
        where: { id: dto.productId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewsCount: allReviews.length
        }
      });

      return { success: true, message: 'Đã gửi đánh giá sản phẩm thành công!', review };
    } catch (error) {
      console.error('[ERROR][reviews.service.ts - createReview]:', error);
      throw error;
    }
  }

  /**
    2. Module sinh Đánh giá Ảo bằng AI (Dành riêng cho Super Admin)
   */
  async generateAISyntheticReviews(dto: GenerateAISyntheticReviewDto) {
    try {
      const count = dto.count || 5;
      const sampleNames = ['Thu Hà', 'Trần Nam', 'Phương Thảo', 'Hoàng Long', 'Minh Anh', 'Khánh Linh'];
      const sampleComments = [
        'Váy mặc ôm dáng rất đẹp, kim tuyến lấp lánh như hình luôn nha shop!',
        'Giao trà sữa cực nhanh trong 20P, kem trứng béo ngậy 10/10.',
        'Serum dùng êm da, mướt mịn không bị châm chít. Rất hài lòng.',
        'Đầm chất lụa satin xịn sò, đóng gói cẩn thận 5 sao!'
      ];

      const createdReviews = [];
      for (let i = 0; i < count; i++) {
        const randomName = sampleNames[i % sampleNames.length];
        const randomComment = sampleComments[i % sampleComments.length];
        const randomRating = Math.random() > 0.2 ? 5 : 4;

        // Create a dummy user for synthetic review
        const dummyUser = await prisma.user.create({
          data: {
            fullName: `[AI User] ${randomName}`,
            email: `ai.user.${Date.now()}.${i}@tqplatform.vn`,
            phone: `099${Math.floor(1000000 + Math.random() * 9000000)}`,
            passwordHash: 'AI_SYNTHETIC_DUMMY_HASH'
          }
        });

        const review = await prisma.review.create({
          data: {
            userId: dummyUser.id,
            productId: dto.productId,
            rating: randomRating,
            comment: `[AI Synthetic Review] ${randomComment}`
          }
        });
        createdReviews.push(review);
      }

      return {
        success: true,
        message: `Đã sinh thành công ${count} đánh giá ảo AI cho sản phẩm!`,
        generatedCount: createdReviews.length
      };
    } catch (error) {
      console.error('[ERROR][reviews.service.ts - generateAISyntheticReviews]:', error);
      throw error;
    }
  }
}
