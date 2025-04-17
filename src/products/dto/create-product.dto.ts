// src/products/dto/create-product.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsUrl()
  image: string;
}
