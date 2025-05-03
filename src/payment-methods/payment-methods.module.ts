import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethod } from './payment-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  providers: [PaymentMethodsService],
  controllers: [PaymentMethodsController],
})
export class PaymentMethodsModule {}