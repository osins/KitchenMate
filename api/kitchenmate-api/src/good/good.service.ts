import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Connection } from 'typeorm';
import { Good } from '../models/good.entity';
import { GoodSpec } from '../models/good-spec.entity';
import { GoodSpecValue } from '../models/good-spec-value.entity';
import { GoodSku } from '../models/good-sku.entity';
import { GoodSkuSpec } from '../models/good-sku-spec.entity';
import { GoodTag } from '../models/good-tag.entity';

@Injectable()
export class GoodService {
  constructor(
    @InjectRepository(Good)
    private goodRepository: Repository<Good>,
    @InjectRepository(GoodSpec)
    private goodSpecRepository: Repository<GoodSpec>,
    @InjectRepository(GoodSpecValue)
    private goodSpecValueRepository: Repository<GoodSpecValue>,
    @InjectRepository(GoodSku)
    private goodSkuRepository: Repository<GoodSku>,
    @InjectRepository(GoodSkuSpec)
    private goodSkuSpecRepository: Repository<GoodSkuSpec>,
    @InjectRepository(GoodTag)
    private goodTagRepository: Repository<GoodTag>,
    private connection: Connection,
  ) {}

  async create(goodData: Partial<Good>): Promise<Good> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 创建商品，使用前端模型字段
      const good = queryRunner.manager.create(Good, {
        ...goodData,
        isPutOnSale: goodData.isPutOnSale ?? 1, // 使用前端模型字段
        available: goodData.available ?? 1,    // 使用前端模型字段
      });
      const savedGood = await queryRunner.manager.save(Good, good);

      // 如果有规格信息，则创建规格
      if (goodData['specList']) {
        for (const spec of goodData['specList']) {
          const goodSpec = queryRunner.manager.create(GoodSpec, {
            specId: spec.specId,
            title: spec.title,
            goodId: savedGood.id,
          });
          const savedSpec = await queryRunner.manager.save(GoodSpec, goodSpec);

          // 为规格创建规格值
          if (spec.specValueList) {
            for (const specValue of spec.specValueList) {
              const goodSpecValue = queryRunner.manager.create(GoodSpecValue, {
                specValueId: specValue.specValueId,
                specId: specValue.specId,
                saasId: specValue.saasId,
                specValue: specValue.specValue,
                image: specValue.image,
                specIdNumber: savedSpec.id,
              });
              await queryRunner.manager.save(GoodSpecValue, goodSpecValue);
            }
          }
        }
      }

      // 如果有SKU信息，则创建SKU
      if (goodData['skuList']) {
        for (const sku of goodData['skuList']) {
          const goodSku = queryRunner.manager.create(GoodSku, {
            skuId: sku.skuId,
            skuImage: sku.skuImage,
            price: parseInt(sku.priceInfo?.[0]?.price) || 0,
            originalPrice: parseInt(sku.priceInfo?.[1]?.price) || 0,
            stockQuantity: sku.stockInfo?.stockQuantity || 0,
            soldQuantity: sku.stockInfo?.soldQuantity || 0,
            goodId: savedGood.id,
          });
          const savedSku = await queryRunner.manager.save(GoodSku, goodSku);

          // 为SKU创建规格关联
          if (sku.specInfo) {
            for (const specInfo of sku.specInfo) {
              const skuSpec = queryRunner.manager.create(GoodSkuSpec, {
                skuId: savedSku.id,
                specId: specInfo.specId,
                specValueId: specInfo.specValueId,
              });
              await queryRunner.manager.save(GoodSkuSpec, skuSpec);
            }
          }
        }
      }

      // 如果有标签信息，则创建标签
      if (goodData['spuTagList']) {
        for (const tag of goodData['spuTagList']) {
          const goodTag = queryRunner.manager.create(GoodTag, {
            tagId: tag.id,
            title: tag.title,
            image: tag.image,
            goodId: savedGood.id,
          });
          await queryRunner.manager.save(GoodTag, goodTag);
        }
      }

      await queryRunner.commitTransaction();
      return savedGood;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    isActive: boolean = true,  // 保留参数用于向后兼容，但不用于查询
    categoryId?: string,
  ): Promise<{ data: Good[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.goodRepository.createQueryBuilder('good')
      .where('good.isPutOnSale = 1'); // 符合前端模型，只显示上架商品

    if (categoryId) {
      queryBuilder.andWhere('FIND_IN_SET(:categoryId, good.categoryIds) > 0', { categoryId });
    }

    queryBuilder.orderBy('good.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Good> {
    const good = await this.goodRepository.findOne({
      where: { id, isPutOnSale: 1 }, // 符合前端模型，只返回上架商品
      relations: ['specs', 'specs.specValues', 'skus', 'tags'],
    });
    
    if (!good) {
      throw new NotFoundException(`Good with ID ${id} not found`);
    }
    
    return good;
  }

  async update(id: number, updateData: Partial<Good>): Promise<Good> {
    const good = await this.findOne(id);
    
    // 更新商品基本信息
    Object.assign(good, {
      ...updateData,
      updatedAt: new Date(),
    });
    
    const updatedGood = await this.goodRepository.save(good);
    return updatedGood;
  }

  async remove(id: number): Promise<void> {
    const good = await this.findOne(id);
    
    // 删除相关的规格、SKU、标签等
    await this.goodSpecRepository.delete({ goodId: id });
    await this.goodSkuRepository.delete({ goodId: id });
    await this.goodTagRepository.delete({ goodId: id });
    
    // 最后删除商品
    await this.goodRepository.remove(good);
  }

  async findGoodsByIds(ids: number[]): Promise<Good[]> {
    return await this.goodRepository.find({
      where: { id: In(ids), isPutOnSale: 1 },
      relations: ['specs', 'specs.specValues', 'skus', 'tags'],
    });
  }
}
