import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 0, limit = 10, search, categoryId, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto;
    
    // 处理页码，如果为0则当作第一页
    const actualPage = page === 0 ? 1 : page;
    
    const where: FindOptionsWhere<Product> = {
      isActive: true,
    };

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (categoryId) {
      where.category = { id: categoryId };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = Between(minPrice || 0, maxPrice || Number.MAX_SAFE_INTEGER);
    }

    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category'],
      order: { [sortBy]: sortOrder },
      skip: (actualPage - 1) * limit,
      take: limit,
    });

    return {
      products,
      pagination: {
        page: actualPage,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    let category: Category | null = null;
    
    if (createProductDto.categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: createProductDto.categoryId },
      });
      
      if (!category) {
        throw new NotFoundException('分类不存在');
      }
    }

    const product = this.productRepository.create({
      ...createProductDto,
      category: category || undefined,
    });

    await this.productRepository.save(product);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });
      
      if (!category) {
        throw new NotFoundException('分类不存在');
      }
      
      product.category = category;
    }

    Object.assign(product, updateProductDto);
    
    await this.productRepository.save(product);
    return product;
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    product.isActive = false;
    await this.productRepository.save(product);

    return { message: '商品已删除' };
  }

  async getCategories() {
    return await this.categoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getFeaturedProducts(limit = 8) {
    return await this.productRepository.find({
      where: { isActive: true },
      order: { sales: 'DESC', createdAt: 'DESC' },
      take: limit,
      relations: ['category'],
    });
  }
}