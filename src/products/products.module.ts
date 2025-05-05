import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { Supplier } from '../suppliers/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Supplier])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}