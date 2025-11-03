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

  @Get('list')
  async fetchGoodsList(
    @Query('pageIndex') pageIndex: string = '0',
    @Query('pageSize') pageSize: string = '20',
  ): Promise<{
    code: number;
    data: {
      goodsList: any[];
      hasMore: boolean;
      total: number;
    };
    message: string;
  }> {
    const parsedPageIndex = Math.abs(parseInt(pageIndex, 10)) || 0;
    const parsedPageSize = parseInt(pageSize, 10) || 20;
    
    const result = await this.goodService.fetchGoodsList(parsedPageIndex, parsedPageSize);
    return {
      code: 200,
      data: result,
      message: 'success'
    };
  }
}
