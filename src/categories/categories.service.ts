import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({ relations: ['parent', 'children'] });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { _id: id },
      relations: ['parent', 'children'],
    });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID ${id}`);
    }
    return category;
  }

  async create(category: Partial<Category>): Promise<Category> {
    const newCategory = this.categoriesRepository.create(category);
    return this.categoriesRepository.save(newCategory);
  }

  async update(id: number, category: Partial<Category>): Promise<Category> {
    const result = await this.categoriesRepository.update(id, category);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID ${id}`);
    }
  }
}