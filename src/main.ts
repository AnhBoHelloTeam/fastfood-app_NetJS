// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // loại bỏ các field không có trong DTO
      forbidNonWhitelisted: true, // báo lỗi nếu có field lạ
      transform: true, // tự động convert types (string -> number,...)
    }),
  );

  await app.listen(3000);
}
bootstrap();
