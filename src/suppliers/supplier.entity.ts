import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('increment')
  _id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @OneToMany(() => Product, (product) => product.supplier)
  products: Product[];
}