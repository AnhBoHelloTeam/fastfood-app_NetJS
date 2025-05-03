import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../orders/order.entity';
import { CartItem } from '../cart-items/cart-item.entity';
import { Feedback } from '../feedbacks/feedback.entity';
import { ChatMessage } from '../chat-messages/chat-message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  _id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  delivery_address: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ type: 'datetime', nullable: true })
  verified_at: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.sender)
  sentMessages: ChatMessage[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.receiver)
  receivedMessages: ChatMessage[];
}