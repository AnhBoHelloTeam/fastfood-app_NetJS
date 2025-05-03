import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) {}

  async findAll(): Promise<CartItem[]> {
    return this.cartItemsRepository.find({ relations: ['user', 'product'] });
  }

  async findOne(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemsRepository.findOne({
      where: { _id: id },
      relations: ['user', 'product'],
    });
    if (!cartItem) {
      throw new NotFoundException(`Không tìm thấy mục giỏ hàng với ID ${id}`);
    }
    return cartItem;
  }

  async create(cartItem: Partial<CartItem>): Promise<CartItem> {
    const newCartItem = this.cartItemsRepository.create(cartItem);
    return this.cartItemsRepository.save(newCartItem);
  }

  async update(id: number, cartItem: Partial<CartItem>): Promise<CartItem> {
    const result = await this.cartItemsRepository.update(id, cartItem);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy mục giỏ hàng với ID ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cartItemsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy mục giỏ hàng với ID ${id}`);
    }
  }
}