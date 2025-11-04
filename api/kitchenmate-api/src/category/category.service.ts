import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Category } from '../models/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create({
      ...categoryData,
      isActive: categoryData.isActive ?? true,
      parentId: categoryData.parentId, // 保持parentId的原始值
    });
    return await this.categoryRepository.save(category);
  }

  async createWithChildren(categoriesData: any[]): Promise<Category[]> {
    const categories: Category[] = [];

    for (const categoryData of categoriesData) {
      const category = await this.createCategoryRecursiveInternal(categoryData);
      if (category) {
        categories.push(category);
      }
    }

    return categories;
  }

  private async createCategoryRecursiveInternal(categoryData: any, parentId?: string): Promise<Category> {
    // 检查是否传入了数组，如果是，则只处理第一个元素
    // 这个检查确保我们处理的是单个对象而不是数组
    if (Array.isArray(categoryData)) {
      throw new Error('createCategoryRecursiveInternal expects a single category object, not an array');
    }

    // 创建当前分类
    const categoryInput: Partial<Category> = {
      groupId: categoryData.groupId,
      name: categoryData.name,
      thumbnail: categoryData.thumbnail,
      parentId: parentId, // 不使用 || null, 直接使用可选的 parentId
      isActive: categoryData.isActive ?? true,
    };

    const category = this.categoryRepository.create(categoryInput);

    const savedCategory = await this.categoryRepository.save(category);

    // 如果有子分类，则递归创建
    if (categoryData.children && Array.isArray(categoryData.children)) {
      for (const child of categoryData.children) {
        await this.createCategoryRecursiveInternal(child, savedCategory.id!);
      }
    }

    return savedCategory;
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { 
        isActive: true 
      } as FindOptionsWhere<Category>,
      order: { id: 'ASC' },
    });
  }

  async findTree(): Promise<Category[]> {
    // 通过 parentId 关系手动构建树形结构
    const allCategories = await this.categoryRepository.find({
      where: { 
        isActive: true 
      } as FindOptionsWhere<Category>,
      order: { id: 'ASC' },
    });

    // 构建树形结构
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // 首先创建所有分类的映射
    allCategories.forEach(category => {
      if (category.id !== undefined) {
        categoryMap.set(category.id, { ...category, children: [] as Category[] });
      }
    });

    // 然后建立父子关系
    allCategories.forEach(category => {
      if (category.id !== undefined) {
        const currentCategory = categoryMap.get(category.id);
        if (currentCategory && (category.parentId === null || category.parentId === undefined)) {
          // 根分类
          rootCategories.push(currentCategory);
        } else if (currentCategory && category.parentId !== null && category.parentId !== undefined) {
          // 子分类，找到其父分类并添加到父分类的 children 中
          const parentCategory = categoryMap.get(category.parentId);
          if (parentCategory && currentCategory) {
            if (!parentCategory.children) {
              parentCategory.children = [];
            }
            parentCategory.children.push(currentCategory);
          }
        }
      }
    });

    return rootCategories;
  }

  async findRootCategories(): Promise<Category[]> {
    // 查找所有根分类（没有父分类的分类）
    return await this.categoryRepository.find({
      where: { 
        isActive: true,
        parentId: undefined
      } as FindOptionsWhere<Category>,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { 
        id, 
        isActive: true 
      } as FindOptionsWhere<Category>,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findByGroupId(groupId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { 
        groupId, 
        isActive: true 
      } as FindOptionsWhere<Category>,
    });
    if (!category) {
      throw new NotFoundException(`Category with groupId ${groupId} not found`);
    }
    return category;
  }

  async update(id: string, updateData: Partial<Category>): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateData, { updatedAt: new Date() });
    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async removeByGroupId(groupId: string): Promise<void> {
    const category = await this.findByGroupId(groupId);
    await this.categoryRepository.remove(category);
  }

  // 根据父ID查找子分类
  async findChildrenByParentId(parentId: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { 
        isActive: true,
        parentId: parentId 
      } as FindOptionsWhere<Category>,
      order: { id: 'ASC' },
    });
  }

  // 根据父groupId查找子分类
  async findChildrenByParentGroupId(parentGroupId: string): Promise<Category[]> {
    const parentCategory = await this.findByGroupId(parentGroupId);
    return await this.findChildrenByParentId(parentCategory.id!);
  }
}