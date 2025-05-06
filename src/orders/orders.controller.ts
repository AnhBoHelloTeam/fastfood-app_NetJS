import { Controller, Get, Post, Put, Delete, Patch, Param, Body, ParseIntPipe, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateOrderDto } from './orders.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  findAll(@Request() req): Promise<Order[]> {
    if (req.user.role === 'admin') {
      return this.ordersService.findAll();
    }
    return this.ordersService.findByUser(req.user._id);
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
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req): Promise<Order> {
    const order = await this.ordersService.create(createOrderDto, req.user._id);
    const admin = await this.usersService.findAdmin();
    if (!admin) {
      throw new NotFoundException('Không tìm thấy admin');
    }
    await this.notificationsService.createNotification(
      `Đơn hàng mới #${order._id} từ user ${req.user.name}`,
      admin._id,
      order,
    );
    return order;
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

  @Patch(':id/confirm')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async confirm(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    const order = await this.ordersService.confirmOrder(id);
    await this.notificationsService.createNotification(
      `Đơn hàng #${id} của user ${order.user.name} đã được xác nhận`,
      order.user._id,
      order,
    );
    return order;
  }

  @Patch(':id/deliver')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  async deliver(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Order> {
    const order = await this.ordersService.findOne(id);
    if (order.user._id !== req.user._id) {
      throw new NotFoundException('Bạn không có quyền xác nhận nhận hàng cho đơn hàng này');
    }
    return this.ordersService.deliverOrder(id);
  }
}