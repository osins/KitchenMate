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
import { Result } from '../models/result.entity';

@Controller('good')
export class GoodController {
  constructor(private readonly goodService: GoodService) {}

  @Post()
  async create(@Body() createGoodDto: any): Promise<Result<Good>> {
    const result = await this.goodService.create(createGoodDto);
    return Result.success(result);
  }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('isActive', ParseBoolPipe) isActive: boolean = true,
    @Query('categoryId') categoryId?: string,
  ): Promise<Result<{
    data: Good[];
    total: number;
    page: number;
    limit: number;
  }>> {
    const result = await this.goodService.findAll(page, limit, isActive, categoryId);
    return Result.success(result);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<Good>> {
    const result = await this.goodService.findOne(id);
    return Result.success(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGoodDto: any,
  ): Promise<Result<Good>> {
    const result = await this.goodService.update(id, updateGoodDto);
    return Result.success(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Result<void>> {
    await this.goodService.remove(id);
    return Result.successVoid();
  }

  @Get('list')
  async fetchGoodsList(
    @Query('pageIndex') pageIndex: string = '0',
    @Query('pageSize') pageSize: string = '20',
  ): Promise<Result<{
    goodsList: any[];
    hasMore: boolean;
    total: number;
  }>> {
    const parsedPageIndex = Math.abs(parseInt(pageIndex, 10)) || 0;
    const parsedPageSize = parseInt(pageSize, 10) || 20;
    
    const result = await this.goodService.fetchGoodsList(parsedPageIndex, parsedPageSize);
    return Result.success(result);
  }
}
