import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethod } from './payment-method.entity';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  findAll(): Promise<PaymentMethod[]> {
    return this.paymentMethodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PaymentMethod> {
    return this.paymentMethodsService.findOne(id);
  }

  @Post()
  create(@Body() paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> {
    return this.paymentMethodsService.create(paymentMethod);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> {
    return this.paymentMethodsService.update(id, paymentMethod);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.paymentMethodsService.remove(id);
  }
}