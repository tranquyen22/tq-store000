import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Mã sản phẩm / dịch vụ' })
  @IsString()
  productId: string;

  @IsNotEmpty({ message: 'Số sao đánh giá (1 - 5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class GenerateAISyntheticReviewDto {
  @IsNotEmpty({ message: 'Mã sản phẩm cần tạo đánh giá AI' })
  @IsString()
  productId: string;

  @IsOptional()
  @IsNumber()
  count?: number;
}
