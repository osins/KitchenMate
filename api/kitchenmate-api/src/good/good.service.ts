import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Connection } from 'typeorm';
import { Good } from '../models/good.entity';
import { GoodSpec } from '../models/good-spec.entity';
import { GoodSpecValue } from '../models/good-spec-value.entity';
import { GoodSku } from '../models/good-sku.entity';
import { GoodTag } from '../models/good-tag.entity';
import { GoodSkuPrice } from '../models/good-sku-price-info.entity';
import { Image } from '../models/image.entity';
import {
  execute,
  executeOneWithRunner,
  executeSaveObjectWithRunner,
  executeWithMap,
  executeWithRunner as executeSaveWithQueryRunner,
  executeUpdateByWheresWithRunner,
} from 'src/common/sync.utils';
import { spec } from 'node:test/reporters';
import { GoodSkuSpecValue } from 'src/models/good-sku-spec-value.entity';

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
    @InjectRepository(GoodTag)
    private goodTagRepository: Repository<GoodTag>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private connection: Connection,
  ) {}

  async create(data: Partial<Good>): Promise<Good> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 处理 desc 字段，如果是数组则转换为字符串
      const processedData = {
        ...data,
        isPutOnSale: data.isPutOnSale ?? 1,
        available: data.available ?? 1,
      };
      
      // 创建商品，使用前端模型字段和雪花 ID
      const savedGood = await executeSaveObjectWithRunner(queryRunner, Good, {
        ...processedData,
      });

      console.log('new good id:', savedGood.id, savedGood)

      // 如果有规格信息，则创建规格
      await executeWithMap(data['specList'], async (spec) => {
        console.log('spec:', spec)

        const savedSpec = await executeSaveObjectWithRunner(
          queryRunner,
          GoodSpec,
          {
            specId: spec.specId,
            title: spec.title,
            goodId: savedGood.id,
          },
        );

        // 为规格创建规格值
        await executeSaveWithQueryRunner(
          spec.specValueList,
          queryRunner,
          GoodSpecValue,
          async (value) => {
            console.log('spec value:', value.specValue, value, spec)

            return {
              goodId: savedGood.id,
              specValueId: value.specValueId,
              specId: value.specId,
              saasId: value.saasId,
              specValue: value.specValue,
              image: value.image,
            };
          },
        );

        return savedSpec;
      });

      // 如果有SKU信息，则创建SKU
      if (data['skuList']) {
        for (const sku of data['skuList']) {
          // 解析priceInfo数组，查找销售价格和划线价格用于SKU基本字段
          let price = 0;
          let originalPrice = 0;

          if (sku.priceInfo && Array.isArray(sku.priceInfo)) {
            for (const priceItem of sku.priceInfo) {
              if (priceItem.priceType === 1) {
                // 销售价格
                price = parseInt(priceItem.price) || 0;
              } else if (priceItem.priceType === 2) {
                // 划线价格
                originalPrice = parseInt(priceItem.price) || 0;
              }
            }
          }

          const savedSku = await executeSaveObjectWithRunner(
            queryRunner,
            GoodSku,
            {
              skuId: sku.skuId,
              skuImage: sku.skuImage,
              price: price,
              originalPrice: originalPrice,
              stockQuantity: sku.stockInfo?.stockQuantity || 0,
              soldQuantity: sku.stockInfo?.soldQuantity || 0,
              goodId: savedGood.id,
            },
          );

          if (savedSku !== undefined && savedSku !== null) {
            // 为SKU创建价格信息
            await executeSaveWithQueryRunner(
              sku.priceInfo,
              queryRunner,
              GoodSkuPrice,
              (price) => {
                return {
                  priceType: price.priceType,
                  price: price.price,
                  priceTypeName: price.priceTypeName,
                  skuId: savedSku.id,
                  goodId: savedGood.id,
                };
              },
            );

            // 为SKU创建规格关联
            await executeSaveWithQueryRunner(
                  sku.specInfo,
                  queryRunner,
                  GoodSkuSpecValue,
                  (spec) => ({
                    goodId: savedGood.id,
                    skuId: savedSku.skuId, 
                    specId: spec.specId,
                    specValueId: spec.specValueId,
                    saasId: savedGood.saasId,
                    specValue: spec.specValue,
                    image: spec.image,
                  })
                );
          }
        }
      }

      // 为商品创建图片记录
      await executeSaveWithQueryRunner(
        data.images,
        queryRunner,
        Image,
        async (url, i) => {
          return {
            url: url,
            type: i === 0 ? 'primary' : 'gallery', // 第一张设为主图，其他为相册图
            subjectId: savedGood.id,
            sortOrder: i,
          };
        },
      );

      // 如果 desc 是数组，转换为 JSON 字符串
      await executeSaveWithQueryRunner(data.desc, queryRunner, Image, async (url, i) => {
        return {
          url: url,
          type: 'desc', // 第一张设为主图，其他为相册图
          subjectId: savedGood.id,
          sortOrder: i,
        };
      });

      // 如果有标签信息，则创建标签
      console.log('spu tag list:', data['spuTagList']);
      await executeSaveWithQueryRunner(
        data['spuTagList'],
        queryRunner,
        GoodTag,
        async (tag) => {
          return {
            tagId: tag.id===undefined || tag.id===null ? null : tag.toString(),
            title: tag.title,
            image: tag.image,
            goodId: savedGood.id,
          };
        },
      );

      await queryRunner.commitTransaction();
      return savedGood;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating good with relations:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    isActive: boolean = true, // 保留参数用于向后兼容，但不用于查询
    categoryId?: string,
  ): Promise<{ data: Good[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.goodRepository
      .createQueryBuilder('good')
      .where('good.isPutOnSale = 1'); // 符合前端模型，只显示上架商品

    if (categoryId) {
      queryBuilder.andWhere('FIND_IN_SET(:categoryId, good.categoryIds) > 0', {
        categoryId,
      });
    }

    queryBuilder.orderBy('good.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Good> {
    const good = await this.goodRepository.findOne({
      where: { id, isPutOnSale: 1 }, // 符合前端模型，只返回上架商品
      relations: ['specList', 'specList.specValueList', 'skuList', 'skuList.specInfo', 'spuTagList'],
    });

    if (!good) {
      throw new NotFoundException(`Good with ID ${id} not found`);
    }

    const skus = await this.goodSkuRepository.find({
      where: {
        goodId: good.id,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    // 从 image 表中查询 subjectId=goods.id && type in (primary,gallery) 的图片记录赋值给good.images
    const images = await this.imageRepository.find({
      where: {
        subjectId: good.id,
        type: In(['primary', 'gallery']),
      },
      order: {
        sortOrder: 'ASC',
      },
    });
    good.images = images.map((img) => img.url);

    // 从 image 表中查询 subjectId=goods.id && type=desc 的图片记录赋值给good.descImages
    const descImages = await this.imageRepository.find({
      where: {
        subjectId: good.id,
        type: 'desc',
      },
      order: {
        sortOrder: 'ASC',
      },
    });
    good.desc = descImages.map((img) => img.url);

    // 从 good_tag 表中查询 goodId=goods.id 的标签记录赋值给good.tags
    const tags = await this.goodTagRepository.find({
      where: {
        goodId: good.id,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    good.spuTagList = tags.map((tag) => ({
      id: tag.id,
      tagId: tag.tagId,
      goodId: tag.goodId,
      title: tag.title,
      image: tag.image,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }));

    return good;
  }

  async update(id: string, updateData: Partial<Good>): Promise<Good> {
    const good = await this.findOne(id);

    // 更新商品基本信息
    Object.assign(good, {
      ...updateData,
      updatedAt: new Date(),
    });

    const updatedGood = await this.goodRepository.save(good);
    return updatedGood;
  }

  async remove(id: string): Promise<void> {
    const good = await this.findOne(id);

    // 删除相关的规格、SKU、标签等
    await this.goodSpecRepository.delete({ goodId: id });
    await this.goodSkuRepository.delete({ goodId: id });
    await this.goodTagRepository.delete({ goodId: id });

    // 最后删除商品
    await this.goodRepository.remove(good);
  }

  async findGoodsByIds(ids: string[]): Promise<Good[]> {
    return await this.goodRepository.find({
      where: { id: In(ids), isPutOnSale: 1 },
      relations: ['specList', 'specList.specValueList', 'skus', 'tags'],
    });
  }

  async fetchGoodsList(
    pageIndex: number = 0,
    pageSize: number = 20,
  ): Promise<{ goodsList: any[]; hasMore: boolean; total: number }> {
    const skip = pageIndex * pageSize;

    const queryBuilder = this.goodRepository
      .createQueryBuilder('good')
      .where('good.isPutOnSale = 1') // 只返回上架商品
      .orderBy('good.createdAt', 'DESC'); // 默认按创建时间排序

    // 多取1个用于判断是否有更多数据
    const [goods, total] = await queryBuilder
      .skip(skip)
      .take(pageSize + 1)
      .getManyAndCount();

    // 判断是否有更多数据
    const hasMore = goods.length > pageSize ? true : false;
    // 如果多取了数据，则只返回pageSize个
    const result = hasMore ? goods.slice(0, pageSize) : goods;

    // 将数据库实体转换为前端需要的格式
    const goodsList = result.map((good) => {
      return {
        id: good.id,
        saasId: good.saasId,
        storeId: good.storeId,
        spuId: good.spuId,
        title: good.title,
        primaryImage: good.primaryImage,
        images: good.images || [good.primaryImage],
        available: good.available,
        minSalePrice: good.minSalePrice,
        minLinePrice: good.minLinePrice,
        maxSalePrice: good.maxSalePrice,
        maxLinePrice: good.maxLinePrice,
        spuStockQuantity: good.spuStockQuantity,
        soldNum: good.soldNum,
        isPutOnSale: good.isPutOnSale,
        categoryIds: good.categoryIds,
        desc: good.desc,
        // 注意：这里需要额外查询关联数据
        specList: good['specList'] || [],
        skuList: good['skuList'] || [],
        spuTagList: good['spuTagList'] || [],
      };
    });

    return {
      goodsList,
      hasMore,
      total,
    };
  }
}
