import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('increment')
  _id: number;

  @ManyToOne(() => User, (user) => user.feedbacks)
  user: User;

  @ManyToOne(() => Product, (product) => product.feedbacks)
  product: Product;

  @Column()
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}