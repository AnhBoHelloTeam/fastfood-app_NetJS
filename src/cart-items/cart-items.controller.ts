import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItem } from './cart-item.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';

@Controller('cart-items')
@UseGuards(AuthGuard('jwt'))
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Get()
  findAll(@GetUser() user: User): Promise<CartItem[]> {
    return this.cartItemsService.findAll(user._id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CartItem> {
    return this.cartItemsService.findOne(id);
  }

  @Post()
  create(@Body() cartItem: { productId: number; quantity?: number }, @GetUser() user: User): Promise<CartItem> {
    return this.cartItemsService.create(cartItem, user._id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() cartItem: { quantity: number },
    @GetUser() user: User,
  ): Promise<CartItem> {
    return this.cartItemsService.update(id, user._id, cartItem);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    return this.cartItemsService.remove(id, user._id);
  }

  @Delete()
  removeAll(@GetUser() user: User): Promise<void> {
    return this.cartItemsService.removeAll(user._id);
  }
}