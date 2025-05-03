import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItem } from './cart-item.entity';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Get()
  findAll(): Promise<CartItem[]> {
    return this.cartItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CartItem> {
    return this.cartItemsService.findOne(id);
  }

  @Post()
  create(@Body() cartItem: Partial<CartItem>): Promise<CartItem> {
    return this.cartItemsService.create(cartItem);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() cartItem: Partial<CartItem>): Promise<CartItem> {
    return this.cartItemsService.update(id, cartItem);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cartItemsService.remove(id);
  }
}