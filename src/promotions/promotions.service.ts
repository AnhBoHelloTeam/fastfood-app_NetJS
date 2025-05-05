import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './promotion.entity';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
  ) {}

  async findAll(): Promise<Promotion[]> {
    return this.promotionsRepository.find({ relations: ['orders'] });
  }

  async findOne(id: number): Promise<Promotion> {
    const promotion = await this.promotionsRepository.findOne({
      where: { _id: id },
      relations: ['orders'],
    });
    if (!promotion) {
      throw new NotFoundException(`Không tìm thấy mã giảm giá với ID ${id}`);
    }
    return promotion;
  }

  async create(promotion: Partial<Promotion>): Promise<Promotion> {
    const newPromotion = this.promotionsRepository.create(promotion);
    return this.promotionsRepository.save(newPromotion);
  }

  async update(id: number, promotion: Partial<Promotion>): Promise<Promotion> {
    const result = await this.promotionsRepository.update(id, promotion);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy mã giảm giá với ID ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.promotionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy mã giảm giá với ID ${id}`);
    }
  }

  async toggleActive(id: number): Promise<Promotion> {
    const promotion = await this.findOne(id);
    promotion.isActive = !promotion.isActive;
    return this.promotionsRepository.save(promotion);
  }
}