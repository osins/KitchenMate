import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { GoodService } from './good.service';
import { Good } from '../models/good.entity';

@Controller('good')
export class GoodController {
  constructor(private readonly goodService: GoodService) {}

  @Post()
  async create(@Body() createGoodDto: any): Promise<Good> {
    return await this.goodService.create(createGoodDto);
  }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('isActive', ParseBoolPipe) isActive: boolean = true,
    @Query('categoryId') categoryId?: string,
  ): Promise<{
    data: Good[];
    total: number;
    page: number;
    limit: number;
  }> {
    return await this.goodService.findAll(page, limit, isActive, categoryId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Good> {
    return await this.goodService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGoodDto: any,
  ): Promise<Good> {
    return await this.goodService.update(id, updateGoodDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.goodService.remove(id);
  }
}
