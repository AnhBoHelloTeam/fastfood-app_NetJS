import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../orders/order.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('increment')
  _id: number;

  @Column()
  name: string;

  @Column()
  is_active: boolean;

  @OneToMany(() => Order, (order) => order.paymentMethodEntity)
  orders: Order[];
}