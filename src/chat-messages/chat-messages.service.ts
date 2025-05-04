import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessagesRepository: Repository<ChatMessage>,
  ) {}

  async findAll(): Promise<ChatMessage[]> {
    return this.chatMessagesRepository.find({ relations: ['sender', 'receiver'] });
  }

  async findOne(id: number): Promise<ChatMessage> {
    const chatMessage = await this.chatMessagesRepository.findOne({
      where: { _id: id },
      relations: ['sender', 'receiver'],
    });
    if (!chatMessage) {
      throw new NotFoundException(`Không tìm thấy tin nhắn với ID ${id}`);
    }
    return chatMessage;
  }

  async create(chatMessage: Partial<ChatMessage> & { senderId: number; receiverId: number }): Promise<ChatMessage> {
    const newChatMessage = this.chatMessagesRepository.create({
      ...chatMessage,
      sender: { _id: chatMessage.senderId } as User,
      receiver: { _id: chatMessage.receiverId } as User,
    });
    return this.chatMessagesRepository.save(newChatMessage);
  }

  async update(id: number, chatMessage: Partial<ChatMessage>): Promise<ChatMessage> {
    const result = await this.chatMessagesRepository.update(id, chatMessage);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy tin nhắn với ID ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.chatMessagesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy tin nhắn với ID ${id}`);
    }
  }
}