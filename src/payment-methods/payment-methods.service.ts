import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './payment-method.entity';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodsRepository: Repository<PaymentMethod>,
  ) {}

  async findAll(): Promise<PaymentMethod[]> {
    return this.paymentMethodsRepository.find({ relations: ['orders'] });
  }

  async findOne(id: number): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodsRepository.findOne({
      where: { _id: id },
      relations: ['orders'],
    });
    if (!paymentMethod) {
      throw new NotFoundException(`Không tìm thấy phương thức thanh toán với ID ${id}`);
    }
    return paymentMethod;
  }

  async create(paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const newPaymentMethod = this.paymentMethodsRepository.create(paymentMethod);
    return this.paymentMethodsRepository.save(newPaymentMethod);
  }

  async update(id: number, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const result = await this.paymentMethodsRepository.update(id, paymentMethod);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy phương thức thanh toán với ID ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.paymentMethodsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy phương thức thanh toán với ID ${id}`);
    }
  }
}