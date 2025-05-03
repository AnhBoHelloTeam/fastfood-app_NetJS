import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { CartItem } from './cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  providers: [CartItemsService],
  controllers: [CartItemsController],
})
export class CartItemsModule {}