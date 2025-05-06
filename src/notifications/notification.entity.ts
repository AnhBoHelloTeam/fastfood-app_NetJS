import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  message: string;

  @Column()
  status: string;

  @ManyToOne(() => User)
  recipient: User;

  @ManyToOne(() => Order, (order) => order.notifications, { nullable: true })
  order?: Order;

  @CreateDateColumn()
  createdAt: Date;
}