import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemsRepository.find({ relations: ['order', 'product'] });
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemsRepository.findOne({
      where: { _id: id },
      relations: ['order', 'product'],
    });
    if (!orderItem) {
      throw new NotFoundException(`Không tìm thấy mục đơn hàng với ID ${id}`);
    }
    return orderItem;
  }

  async create(data: { order: Order; product: Product; quantity: number; price: number }): Promise<OrderItem> {
    const orderItem = this.orderItemsRepository.create(data);
    return this.orderItemsRepository.save(orderItem);
  }

  async update(id: number, orderItem: Partial<OrderItem>): Promise<OrderItem> {
    const result = await this.orderItemsRepository.update(id, orderItem);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy mục đơn hàng với ID ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderItemsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy mục đơn hàng với ID ${id}`);
    }
  }
}