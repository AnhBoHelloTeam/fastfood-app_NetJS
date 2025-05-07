import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { Feedback } from './feedback.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateFeedbackDto } from './feedbacks.dto';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Get()
  findAll(): Promise<Feedback[]> {
    return this.feedbacksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Feedback> {
    return this.feedbacksService.findOne(id);
  }

  @Get('product/:productId')
  async getFeedbackByProduct(@Param('productId', ParseIntPipe) productId: number) {
    const feedbacks = await this.feedbacksService.findByProduct(productId);
    return { data: feedbacks, averageRating: feedbacks.length ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length : 0, totalFeedbacks: feedbacks.length };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  create(@Body() createFeedbackDto: CreateFeedbackDto, @Request() req): Promise<Feedback> {
    return this.feedbacksService.create({ ...createFeedbackDto, userId: req.user._id });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user', 'admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() feedback: Partial<Feedback>,
    @Request() req,
  ): Promise<Feedback> {
    const existingFeedback = await this.feedbacksService.findOne(id);
    if (req.user.role !== 'admin' && existingFeedback.user._id !== req.user._id) {
      throw new NotFoundException('Bạn không có quyền chỉnh sửa đánh giá này');
    }
    return this.feedbacksService.update(id, feedback);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user', 'admin')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    const existingFeedback = await this.feedbacksService.findOne(id);
    if (req.user.role !== 'admin' && existingFeedback.user._id !== req.user._id) {
      throw new NotFoundException('Bạn không có quyền xóa đánh giá này');
    }
    return this.feedbacksService.remove(id);
  }
}