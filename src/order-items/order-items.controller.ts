import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItem } from './order-item.entity';
import { OrderItemDto } from './order-items.dto';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get()
  findAll(): Promise<OrderItem[]> {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderItem> {
    return this.orderItemsService.findOne(id);
  }

  @Post()
  async create(@Body() orderItemDto: OrderItemDto): Promise<OrderItem> {
    const orderItem = {
      order: { _id: orderItemDto.orderId } as Order,
      product: { _id: orderItemDto.productId } as Product,
      quantity: orderItemDto.quantity,
      price: orderItemDto.price,
    };
    return this.orderItemsService.create(orderItem);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() orderItem: Partial<OrderItem>): Promise<OrderItem> {
    return this.orderItemsService.update(id, orderItem);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.orderItemsService.remove(id);
  }
}