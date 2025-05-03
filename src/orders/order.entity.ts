import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { Promotion } from '../promotions/promotion.entity';
import { PaymentMethod } from '../payment-methods/payment-method.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('increment')
  _id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column('decimal')
  totalAmount: number;

  @Column()
  status: string;

  @Column()
  shipping_address: string;

  @Column('decimal')
  shipping_fee: number;

  @Column()
  paymentMethod: string;

  @Column()
  payment_status: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  order_notes: string;

  @Column({ nullable: true })
  promotion_code: string;

  @Column({ type: 'datetime', nullable: true })
  delivered_at: Date;

  @Column({ type: 'datetime', nullable: true })
  cancelled_at: Date;

  @Column({ nullable: true })
  cancellation_reason: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(() => Promotion, (promotion) => promotion.orders, { nullable: true })
  promotion: Promotion;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.orders)
  paymentMethodEntity: PaymentMethod;
}