import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private feedbacksRepository: Repository<Feedback>,
  ) {}

  async findAll(): Promise<Feedback[]> {
    return this.feedbacksRepository.find({ relations: ['user', 'product'] });
  }

  async findOne(id: number): Promise<Feedback> {
    const feedback = await this.feedbacksRepository.findOne({
      where: { _id: id },
      relations: ['user', 'product'],
    });
    if (!feedback) {
      throw new NotFoundException(`Không tìm thấy đánh giá với ID ${id}`);
    }
    return feedback;
  }

  async create(feedback: Partial<Feedback>): Promise<Feedback> {
    const newFeedback = this.feedbacksRepository.create(feedback);
    return this.feedbacksRepository.save(newFeedback);
  }

  async update(id: number, feedback: Partial<Feedback>): Promise<Feedback> {
    const result = await this.feedbacksRepository.update(id, feedback);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy đánh giá với ID ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.feedbacksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy đánh giá với ID ${id}`);
    }
  }
}