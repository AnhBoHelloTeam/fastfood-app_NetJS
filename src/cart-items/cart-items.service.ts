import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(userId: number): Promise<CartItem[]> {
    return this.cartItemsRepository.find({
      where: { user: { _id: userId } },
      relations: ['user', 'product', 'product.supplier'],
    });
  }

  async findOne(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemsRepository.findOne({
      where: { _id: id },
      relations: ['user', 'product', 'product.supplier'],
    });
    if (!cartItem) {
      throw new NotFoundException(`Không tìm thấy mục giỏ hàng với ID ${id}`);
    }
    return cartItem;
  }

  async create(
    cartItem: { productId: number; quantity?: number },
    userId: number,
  ): Promise<CartItem> {
    const { productId, quantity } = cartItem;

    const product = await this.productRepository.findOne({
      where: { _id: productId },
      relations: ['supplier'],
    });
    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${productId} không tồn tại`);
    }

    const existingCartItem = await this.cartItemsRepository.findOne({
      where: {
        user: { _id: userId },
        product: { _id: productId },
      },
      relations: ['user', 'product'],
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity || 1;
      return this.cartItemsRepository.save(existingCartItem);
    }

    const newCartItem = this.cartItemsRepository.create({
      user: { _id: userId } as User,
      product,
      quantity: quantity || 1,
    });

    const savedItem = await this.cartItemsRepository.save(newCartItem);

    return this.findOne(savedItem._id);
  }

  async update(id: number, userId: number, data: { quantity: number }): Promise<CartItem> {
    const cartItem = await this.cartItemsRepository.findOne({
      where: { _id: id, user: { _id: userId } },
      relations: ['user', 'product'],
    });
    if (!cartItem) {
      throw new NotFoundException(`Không tìm thấy mục giỏ hàng với ID ${id}`);
    }
    if (data.quantity <= 0) {
      throw new BadRequestException('Số lượng phải lớn hơn 0');
    }
    cartItem.quantity = data.quantity;
    return this.cartItemsRepository.save(cartItem);
  }

  async remove(id: number, userId: number): Promise<void> {
    const result = await this.cartItemsRepository.delete({ _id: id, user: { _id: userId } });
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy mục giỏ hàng với ID ${id}`);
    }
  }

  async removeAll(userId: number): Promise<void> {
    const cartItems = await this.findAll(userId);
    if (cartItems.length === 0) {
      return;
    }
    await this.cartItemsRepository.remove(cartItems);
  }
}