import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['user', 'orderItems'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { _id: id },
      relations: ['user', 'orderItems'],
    });
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }
    return order;
  }

  async create(orderDto: CreateOrderDto): Promise<Order> {
    // Kiểm tra tồn kho cho từng orderItem
    for (const item of orderDto.orderItems) {
      const product = await this.productsRepository.findOne({ where: { _id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${item.productId}`);
      }
      if (product.quantity_in_stock < item.quantity) {
        throw new BadRequestException(`Sản phẩm ${product.name} không đủ tồn kho. Còn lại: ${product.quantity_in_stock}`);
      }
    }

    // Tạo đơn hàng
    const newOrder = this.ordersRepository.create({
      ...orderDto,
      user: { _id: orderDto.userId } as User,
      orderItems: orderDto.orderItems.map(item => ({
        product: { _id: item.productId } as Product,
        quantity: item.quantity,
      })),
    });

    // Cập nhật tồn kho
    for (const item of orderDto.orderItems) {
      await this.productsRepository.decrement({ _id: item.productId }, 'quantity_in_stock', item.quantity);
    }

    return this.ordersRepository.save(newOrder);
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
}