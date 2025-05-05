import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { Product } from '../products/product.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Get(':id/products')
  findProductsByCategory(@Param('id', ParseIntPipe) id: number): Promise<Product[]> {
    return this.categoriesService.findProductsByCategory(id);
  }

  @Post()
  create(@Body() category: Partial<Category>): Promise<Category> {
    return this.categoriesService.create(category);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() category: Partial<Category>): Promise<Category> {
    return this.categoriesService.update(id, category);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}