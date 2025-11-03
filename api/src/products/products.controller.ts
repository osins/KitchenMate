import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.productsService.findAll(paginationDto);
    return {
      success: true,
      data: result.products,
      pagination: result.pagination,
    };
  }

  @Get('categories')
  async getCategories() {
    const categories = await this.productsService.getCategories();
    return {
      success: true,
      data: categories,
    };
  }

  @Get('featured')
  async getFeaturedProducts() {
    const products = await this.productsService.getFeaturedProducts();
    return {
      success: true,
      data: products,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(parseInt(id));
    return {
      success: true,
      data: product,
    };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      success: true,
      message: '商品创建成功',
      data: product,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productsService.update(parseInt(id), updateProductDto);
    return {
      success: true,
      message: '商品更新成功',
      data: product,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const result = await this.productsService.remove(parseInt(id));
    return {
      success: true,
      message: result.message,
    };
  }
}