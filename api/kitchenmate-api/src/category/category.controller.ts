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
import { Result } from '../models/result.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: any): Promise<Result<Category | Category[]>> {
    if (createCategoryDto.groupId && createCategoryDto.name) {
      // 单个分类创建
      const result = await this.categoryService.create(createCategoryDto);
      return Result.success(result);
    } else {
      // 批量创建分类树结构
      const result = await this.categoryService.createWithChildren(createCategoryDto);
      return Result.success(result);
    }
  }

  @Post('tree')
  async createTree(@Body() createCategoryTreeDto: any[]): Promise<Result<Category[]>> {
    const result = await this.categoryService.createWithChildren(createCategoryTreeDto);
    return Result.success(result);
  }

  @Get()
  async findAll(): Promise<Result<Category[]>> {
    const result = await this.categoryService.findAll();
    return Result.success(result);
  }

  @Get('tree')
  async findTree(): Promise<Result<Category[]>> {
    const result = await this.categoryService.findTree();
    return Result.success(result);
  }

  @Get('root')
  async findRootCategories(): Promise<Result<Category[]>> {
    const result = await this.categoryService.findRootCategories();
    return Result.success(result);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<Result<Category>> {
    const result = await this.categoryService.findOne(id);
    return Result.success(result);
  }

  @Get('group/:groupId')
  async findByGroupId(
    @Param('groupId') groupId: string,
  ): Promise<Result<Category>> {
    const result = await this.categoryService.findByGroupId(groupId);
    return Result.success(result);
  }

  @Get('parent/:parentId/children')
  async findChildrenByParentId(
    @Param('parentId') parentId: string,
  ): Promise<Result<Category[]>> {
    const result = await this.categoryService.findChildrenByParentId(parentId);
    return Result.success(result);
  }

  @Get('parent/group/:parentGroupId/children')
  async findChildrenByParentGroupId(
    @Param('parentGroupId') parentGroupId: string,
  ): Promise<Result<Category[]>> {
    const result = await this.categoryService.findChildrenByParentGroupId(parentGroupId);
    return Result.success(result);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<Category>,
  ): Promise<Result<Category>> {
    const result = await this.categoryService.update(id, updateCategoryDto);
    return Result.success(result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Result<void>> {
    await this.categoryService.remove(id);
    return Result.successVoid();
  }

  @Delete('group/:groupId')
  async removeByGroupId(@Param('groupId') groupId: string): Promise<Result<void>> {
    await this.categoryService.removeByGroupId(groupId);
    return Result.successVoid();
  }
}