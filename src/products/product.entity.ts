import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { CartItem } from '../cart-items/cart-item.entity';
import { Feedback } from '../feedbacks/feedback.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('increment')
  _id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  description_detail: string;

  @Column()
  image: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ default: true })
  available: boolean;

  @Column()
  unit: string;

  @Column()
  slug: string;

  @Column('decimal', { nullable: true })
  discount_price: number;

  @Column({ type: 'datetime', nullable: true })
  start_discount: Date;

  @Column({ type: 'datetime', nullable: true })
  end_discount: Date;

  @Column()
  quantity_in_stock: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  supplier: Supplier;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => Feedback, (feedback) => feedback.product)
  feedbacks: Feedback[];
}