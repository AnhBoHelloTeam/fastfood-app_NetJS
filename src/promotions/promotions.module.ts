import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { Promotion } from './promotion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion])],
  providers: [PromotionsService],
  controllers: [PromotionsController],
})
export class PromotionsModule {}