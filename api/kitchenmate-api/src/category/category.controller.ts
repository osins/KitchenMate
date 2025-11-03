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
import { CategoryService } from './category.service';
import { Category } from '../models/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: any): Promise<Category | Category[]> {
    if (createCategoryDto.groupId && createCategoryDto.name) {
      // 单个分类创建
      return await this.categoryService.create(createCategoryDto);
    } else {
      // 批量创建分类树结构
      return await this.categoryService.createWithChildren(createCategoryDto);
    }
  }

  @Post('tree')
  async createTree(@Body() createCategoryTreeDto: any[]): Promise<Category[]> {
    return await this.categoryService.createWithChildren(createCategoryTreeDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Get('tree')
  async findTree(): Promise<Category[]> {
    return await this.categoryService.findTree();
  }

  @Get('root')
  async findRootCategories(): Promise<Category[]> {
    return await this.categoryService.findRootCategories();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category> {
    return await this.categoryService.findOne(id);
  }

  @Get('group/:groupId')
  async findByGroupId(
    @Param('groupId') groupId: string,
  ): Promise<Category> {
    return await this.categoryService.findByGroupId(groupId);
  }

  @Get('parent/:parentId/children')
  async findChildrenByParentId(
    @Param('parentId', ParseIntPipe) parentId: number,
  ): Promise<Category[]> {
    return await this.categoryService.findChildrenByParentId(parentId);
  }

  @Get('parent/group/:parentGroupId/children')
  async findChildrenByParentGroupId(
    @Param('parentGroupId') parentGroupId: string,
  ): Promise<Category[]> {
    return await this.categoryService.findChildrenByParentGroupId(parentGroupId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: Partial<Category>,
  ): Promise<Category> {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.categoryService.remove(id);
  }

  @Delete('group/:groupId')
  async removeByGroupId(@Param('groupId') groupId: string): Promise<void> {
    return await this.categoryService.removeByGroupId(groupId);
  }
}