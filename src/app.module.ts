import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';

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
  ],
})
export class AppModule {}