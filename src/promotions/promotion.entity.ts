import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../orders/order.entity';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('increment')
  _id: number;

  @Column()
  code: string;

  @Column('decimal')
  discountValue: number;

  @Column()
  discountType: number;

  @Column({ type: 'datetime' })
  validFrom: Date;

  @Column({ type: 'datetime' })
  validTo: Date;

  @Column()
  isActive: boolean;

  @Column()
  promotion_type: string;

  @Column('decimal')
  discount_amount: number;

  @Column('decimal')
  min_order_value: number;

  @Column('decimal')
  max_discount_amount: number;

  @Column()
  usage_limit: number;

  @Column()
  usage_count: number;

  @OneToMany(() => Order, (order) => order.promotion)
  orders: Order[];
}