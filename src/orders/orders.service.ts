import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { OrderItemsService } from '../order-items/order-items.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto } from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private orderItemsService: OrderItemsService,
    private notificationsService: NotificationsService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ 
      relations: ['user', 'orderItems', 'orderItems.product', 'orderItems.product.supplier', 'promotion', 'paymentMethodEntity', 'notifications'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { _id: userId } },
      relations: ['user', 'orderItems', 'orderItems.product', 'orderItems.product.supplier', 'promotion', 'paymentMethodEntity', 'notifications'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { _id: id },
      relations: ['user', 'orderItems', 'orderItems.product', 'orderItems.product.supplier', 'promotion', 'paymentMethodEntity', 'notifications'],
    });
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    for (const item of createOrderDto.orderItems) {
      const product = await this.productsRepository.findOne({ where: { _id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${item.productId}`);
      }
      if (product.quantity_in_stock < item.quantity) {
        throw new BadRequestException(`Sản phẩm ${product.name} không đủ tồn kho. Còn lại: ${product.quantity_in_stock}`);
      }
    }

    const newOrder = this.ordersRepository.create({
      ...createOrderDto,
      user: { _id: userId } as User,
      orderItems: [],
      createdAt: new Date(),
    });

    const savedOrder = await this.ordersRepository.save(newOrder);

    for (const item of createOrderDto.orderItems) {
      const product = await this.productsRepository.findOne({ where: { _id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${item.productId}`);
      }
      await this.orderItemsService.create({
        order: savedOrder,
        product,
        quantity: item.quantity,
        price: product.price,
      });
      product.quantity_in_stock -= item.quantity;
      await this.productsRepository.save(product);
    }

    return this.findOne(savedOrder._id);
  }

  async update(id: number, order: Partial<Order>): Promise<Order> {
    const result = await this.ordersRepository.update(id, order);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }
  }

  async confirmOrder(id: number): Promise<Order> {
    const order = await this.findOne(id);
    if (order.status !== 'pending') {
      throw new BadRequestException(`Đơn hàng không ở trạng thái pending`);
    }
    order.status = 'shipped';
    return this.ordersRepository.save(order);
  }

  async deliverOrder(id: number): Promise<Order> {
    const order = await this.findOne(id);
    if (order.status !== 'shipped') {
      throw new BadRequestException(`Đơn hàng không ở trạng thái shipped`);
    }
    order.status = 'delivered';
    return this.ordersRepository.save(order);
  }
}