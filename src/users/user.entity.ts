import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment') // Thay 'uuid' bằng 'increment'
  _id: number; // Thay 'string' bằng 'number'

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
}