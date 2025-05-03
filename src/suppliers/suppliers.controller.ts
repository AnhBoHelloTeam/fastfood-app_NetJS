import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './supplier.entity';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  findAll(): Promise<Supplier[]> {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Supplier> {
    return this.suppliersService.findOne(id);
  }

  @Post()
  create(@Body() supplier: Partial<Supplier>): Promise<Supplier> {
    return this.suppliersService.create(supplier);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() supplier: Partial<Supplier>): Promise<Supplier> {
    return this.suppliersService.update(id, supplier);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.suppliersService.remove(id);
  }
}