import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessage } from './chat-message.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage]),
    UsersModule, // Nhập UsersModule để cung cấp UsersService
  ],
  providers: [ChatMessagesService],
  controllers: [ChatMessagesController],
})
export class ChatMessagesModule {}