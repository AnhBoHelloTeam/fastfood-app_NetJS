import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['category', 'supplier'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { _id: id },
      relations: ['category', 'supplier'],
    });
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${id}`);
    }
    return product;
  }

  async create(product: Partial<Product>): Promise<Product> {
    const requiredFields = ['name', 'price', 'description', 'image', 'unit', 'slug', 'quantity_in_stock', 'category', 'supplier'];
    const missingFields = requiredFields.filter((field) => !product[field]);
    if (missingFields.length > 0) {
      throw new BadRequestException(`Vui lòng cung cấp: ${missingFields.join(', ')}`);
    }
    const newProduct = this.productsRepository.create(product);
    return this.productsRepository.save(newProduct);
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    const result = await this.productsRepository.update(id, product);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${id}`);
    }
  }
}