/**
 * 商品SKU实体类
 * 用于表示商品的库存量单位（Stock Keeping Unit），包含商品的价格、库存、规格等信息。
 * SKU是商品管理的最小单元，同一商品的不同规格（如颜色、尺寸）对应不同的SKU。
 */
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'; // TypeORM 装饰器和工具
import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator'; // 数据验证装饰器
import { Good } from './good.entity'; // 商品实体类
import { GoodSkuPrice } from './good-sku-price-info.entity'; // 商品SKU价格信息实体类
import { GoodSkuStock } from './good-sku-stock.entity'; // 商品SKU库存信息实体类
import { GoodSpecValue } from './good-spec-value.entity'; // 商品规格值实体类
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from 'src/common/snowflake/snowflake.service'; // 雪花ID默认长度
import { GoodSkuSpecValue } from './good-sku-spec-value.entity';

@Entity('good_skus') // 数据库表名
export class GoodSku {
  @PrimaryColumn({type:'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH}) // 主键列，使用雪花ID
  id: string; // SKU的唯一标识符，采用雪花算法生成

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH, unique: true}) // 字符串类型，长度限制为50
  @IsString() // 验证字段为字符串
  skuId: string; // SKU编号，用于业务标识和外部系统对接

  @Column({ type: 'varchar', length: 500, nullable: true }) // 可选的字符串类型，长度限制为500
  @IsOptional() // 可选字段
  @IsString() // 验证字段为字符串
  skuImage?: string; // SKU图片URL，展示该规格商品的图片

  @Column({ type: 'int', default: 0 }) // 整数类型，默认值为0
  @IsNumber() // 验证字段为数字
  @Min(0) // 最小值约束为0
  price: number; // 当前售价，单位为分

  @Column({ type: 'int', default: 0 }) // 整数类型，默认值为0
  @IsNumber() // 验证字段为数字
  @Min(0) // 最小值约束为0
  originalPrice: number; // 原价，用于显示折扣信息

  @Column({ type: 'int', default: 0 }) // 整数类型，默认值为0
  @IsNumber() // 验证字段为数字
  @Min(0) // 最小值约束为0
  stockQuantity: number; // 当前库存数量，实时库存

  @Column({ type: 'int', default: 0 }) // 整数类型，默认值为0
  @IsNumber() // 验证字段为数字
  @Min(0) // 最小值约束为0
  safeStockQuantity: number; // 安全库存数量，低于此数量时触发预警

  @Column({ type: 'int', default: 0 }) // 整数类型，默认值为0
  @IsNumber() // 验证字段为数字
  @Min(0) // 最小值约束为0
  soldQuantity: number; // 已售数量，用于统计销量

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH, nullable: true}) // 字符串类型，长度限制为雪花ID长度，可为空
  @IsString() // 验证字段为字符串
  goodId: string; // 关联的商品ID，指向所属商品

  @CreateDateColumn({ type: 'timestamp' }) // 创建时间列，自动生成
  @IsDateString() // 验证字段为日期字符串
  createdAt: Date; // 创建时间，记录SKU首次创建的时间

  @UpdateDateColumn({ type: 'timestamp' }) // 更新时间列，自动生成
  @IsDateString() // 验证字段为日期字符串
  updatedAt: Date; // 更新时间，记录SKU最后修改的时间

  @ManyToOne(() => Good, good => good.skuList) // 多对一关系，关联到商品实体
  @JoinColumn({ name: 'goodId' }) // 外键列名
  good: Good; // 关联的商品实体，表示该SKU属于哪个商品

  @OneToMany(() => GoodSkuSpecValue, specValue => specValue.sku) // 一对多关系，关联到商品规格值实
  specInfo: GoodSkuSpecValue[]; // 关联的商品规格值列表，描述该SKU的具体规格属性

  @OneToMany(() => GoodSkuPrice, priceInfo => priceInfo.sku) // 一对多关系，关联到商品SKU价格信息实体
  priceInfo: GoodSkuPrice[]; // 关联的商品SKU价格信息列表，记录价格历史

  stockInfo: GoodSkuStock; // 商品SKU库存信息，包含库存相关的详细信息
}