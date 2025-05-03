import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
  ) {}

  async findAll(): Promise<Supplier[]> {
    return this.suppliersRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOne({
      where: { _id: id },
      relations: ['products'],
    });
    if (!supplier) {
      throw new NotFoundException(`Không tìm thấy nhà cung cấp với ID ${id}`);
    }
    return supplier;
  }

  async create(supplier: Partial<Supplier>): Promise<Supplier> {
    const newSupplier = this.suppliersRepository.create(supplier);
    return this.suppliersRepository.save(newSupplier);
  }

  async update(id: number, supplier: Partial<Supplier>): Promise<Supplier> {
    const result = await this.suppliersRepository.update(id, supplier);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy nhà cung cấp với ID ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.suppliersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy nhà cung cấp với ID ${id}`);
    }
  }
}