import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessage } from './chat-message.entity';

@Controller('chat-messages')
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  @Get()
  findAll(): Promise<ChatMessage[]> {
    return this.chatMessagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ChatMessage> {
    return this.chatMessagesService.findOne(id);
  }

  @Post()
  create(@Body() chatMessage: Partial<ChatMessage>): Promise<ChatMessage> {
    return this.chatMessagesService.create(chatMessage);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() chatMessage: Partial<ChatMessage>): Promise<ChatMessage> {
    return this.chatMessagesService.update(id, chatMessage);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.chatMessagesService.remove(id);
  }
}