import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
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

  async create(order: Partial<Order>): Promise<Order> {
    const newOrder = this.ordersRepository.create(order);
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