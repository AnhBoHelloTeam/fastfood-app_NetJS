import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.productRepo.find();
  }

  findOne(id: number) {
    return this.productRepo.findOneBy({ id });
  }

  create(createProductDto: CreateProductDto) {
    const product = this.productRepo.create(createProductDto);
    return this.productRepo.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.productRepo.update(id, updateProductDto);
    const updated = await this.productRepo.findOneBy({ id });
    if (!updated) throw new NotFoundException(`Product #${id} not found`);
    return updated;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return this.productRepo.remove(product);
  }
}
