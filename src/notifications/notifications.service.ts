import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createNotification(message: string, recipientId: number, order?: Order) {
    const recipient = await this.userRepository.findOne({
      where: { _id: recipientId },
    });
    if (!recipient) {
      throw new Error('Recipient not found');
    }

    const notification = this.notificationRepository.create({
      message,
      status: 'unread',
      recipient,
      order: order ? { _id: order._id } : undefined,
    });

    return this.notificationRepository.save(notification);
  }

  async getNotifications(): Promise<Notification[]> {
    return this.notificationRepository.find({
      relations: ['recipient', 'order', 'order.user'],
      order: { createdAt: 'DESC' },
    });
  }
}