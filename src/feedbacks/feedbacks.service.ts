import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { CreateFeedbackDto } from './feedbacks.dto';

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

  async create(feedbackDto: CreateFeedbackDto): Promise<Feedback> {
    // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
    const existingFeedback = await this.feedbacksRepository.findOne({
      where: { user: { _id: feedbackDto.userId }, product: { _id: feedbackDto.productId } },
    });
    if (existingFeedback) {
      throw new BadRequestException('Bạn đã đánh giá sản phẩm này rồi');
    }

    const newFeedback = this.feedbacksRepository.create({
      ...feedbackDto,
      user: { _id: feedbackDto.userId } as User,
      product: { _id: feedbackDto.productId } as Product,
    });
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

  async getProductFeedback(productId: number) {
    const feedbacks = await this.feedbacksRepository.find({
      where: { product: { _id: productId } },
      relations: ['user', 'product'],
    });
    const totalFeedbacks = feedbacks.length;
    const averageRating = totalFeedbacks > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks
      : 0;
    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalFeedbacks,
      feedbacks,
    };
  }
}