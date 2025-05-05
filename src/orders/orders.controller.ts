import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateOrderDto } from './orders.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Order> {
    const order = await this.ordersService.findOne(id);
    if (req.user.role !== 'admin' && order.user._id !== req.user._id) {
      throw new NotFoundException('Bạn không có quyền xem đơn hàng này');
    }
    return order;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  create(@Body() createOrderDto: CreateOrderDto, @Request() req): Promise<Order> {
    return this.ordersService.create(createOrderDto, req.user._id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() order: Partial<Order>): Promise<Order> {
    return this.ordersService.update(id, order);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.remove(id);
  }
}