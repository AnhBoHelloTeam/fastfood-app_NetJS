import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { Feedback } from './feedback.entity';

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

  @Post()
  create(@Body() feedback: Partial<Feedback>): Promise<Feedback> {
    return this.feedbacksService.create(feedback);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() feedback: Partial<Feedback>): Promise<Feedback> {
    return this.feedbacksService.update(id, feedback);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.feedbacksService.remove(id);
  }
}