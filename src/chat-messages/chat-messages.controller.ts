import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, NotFoundException, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessage } from './chat-message.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from '../users/users.service';

@Controller('chat-messages')
export class ChatMessagesController {
  constructor(
    private readonly chatMessagesService: ChatMessagesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user', 'admin')
  async findAll(@Request() req): Promise<ChatMessage[]> {
    const messages = await this.chatMessagesService.findAll();
    if (req.user.role !== 'admin') {
      return messages.filter(
        (msg) => msg.sender._id === req.user._id || msg.receiver._id === req.user._id,
      );
    }
    return messages;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user', 'admin')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<ChatMessage> {
    const message = await this.chatMessagesService.findOne(id);
    if (req.user.role !== 'admin' && message.sender._id !== req.user._id && message.receiver._id !== req.user._id) {
      throw new NotFoundException('Bạn không có quyền xem tin nhắn này');
    }
    return message;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user', 'admin')
  async create(@Body() chatMessage: Partial<ChatMessage> & { receiverId: number }, @Request() req): Promise<ChatMessage> {
    if (req.user.role === 'user') {
      // User chỉ nhắn được tới admin
      const admin = await this.usersService.findAdmin();
      if (chatMessage.receiverId && chatMessage.receiverId !== admin._id) {
        throw new BadRequestException('User chỉ có thể nhắn tin tới admin');
      }
      return this.chatMessagesService.create({
        ...chatMessage,
        senderId: req.user._id,
        receiverId: admin._id,
      });
    }
    // Admin có thể nhắn tới bất kỳ user
    if (!chatMessage.receiverId) {
      throw new BadRequestException('ReceiverId là bắt buộc cho admin');
    }
    return this.chatMessagesService.create({
      ...chatMessage,
      senderId: req.user._id,
      receiverId: chatMessage.receiverId,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user', 'admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() chatMessage: Partial<ChatMessage>,
    @Request() req,
  ): Promise<ChatMessage> {
    const existingMessage = await this.chatMessagesService.findOne(id);
    if (req.user.role !== 'admin' && existingMessage.sender._id !== req.user._id) {
      throw new NotFoundException('Bạn không có quyền chỉnh sửa tin nhắn này');
    }
    return this.chatMessagesService.update(id, chatMessage);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user', 'admin')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    const existingMessage = await this.chatMessagesService.findOne(id);
    if (req.user.role !== 'admin' && existingMessage.sender._id !== req.user._id) {
      throw new NotFoundException('Bạn không có quyền xóa tin nhắn này');
    }
    return this.chatMessagesService.remove(id);
  }
}