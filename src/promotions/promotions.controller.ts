import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { Promotion } from './promotion.entity';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  findAll(): Promise<Promotion[]> {
    return this.promotionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Promotion> {
    return this.promotionsService.findOne(id);
  }

  @Post()
  create(@Body() promotion: Partial<Promotion>): Promise<Promotion> {
    return this.promotionsService.create(promotion);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() promotion: Partial<Promotion>): Promise<Promotion> {
    return this.promotionsService.update(id, promotion);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.promotionsService.remove(id);
  }
}