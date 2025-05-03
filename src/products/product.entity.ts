import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';

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
}