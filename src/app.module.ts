import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { PromotionsModule } from './promotions/promotions.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // Thay bằng username MySQL của bạn
      password: '21082004', // Thay bằng password MySQL của bạn
      database: 'fastfood',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Đặt thành false khi triển khai sản phẩm thật
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    SuppliersModule,
    OrdersModule,
    OrderItemsModule,
    PromotionsModule,
    PaymentMethodsModule,
    CartItemsModule,
    FeedbacksModule,
    ChatMessagesModule,
    AuthModule,
    NotificationsModule,
    ChatModule,
  ],
})
export class AppModule {}