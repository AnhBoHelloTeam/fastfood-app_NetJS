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

  @Column({ type: 'enum', enum: ['percentage', 'fixed'], default: 'percentage' })
  discountType: 'percentage' | 'fixed';

  @Column({ type: 'datetime' })
  validFrom: Date;

  @Column({ type: 'datetime' })
  validTo: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column('decimal', { default: 0 })
  min_order_value: number;

  @Column('decimal', { default: 0 })
  max_discount_amount: number;

  @Column({ default: 0 })
  usage_limit: number;

  @Column({ default: 0 })
  usage_count: number;

  @OneToMany(() => Order, (order) => order.promotion)
  orders: Order[];
}