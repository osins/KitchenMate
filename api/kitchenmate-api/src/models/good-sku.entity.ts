import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { Good } from './good.entity';
import { GoodSkuPrice } from './good-sku-price-info.entity';
import { GoodSkuStock } from './good-sku-stock.entity';
import { GoodSpecValue } from './good-spec-value.entity';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from 'src/common/snowflake/snowflake.service';

@Entity('good_skus')
export class GoodSku {
  @PrimaryColumn({type:'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH})
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  skuId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  skuImage?: string;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  originalPrice: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  safeStockQuantity: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  soldQuantity: number;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH, nullable: true})
  @IsString()
  goodId: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  @ManyToOne(() => Good, good => good.skuList)
  @JoinColumn({ name: 'goodId' })
  good: Good;

  @OneToMany(() => GoodSpecValue, skuSpec => skuSpec.sku)
  specInfo: GoodSpecValue[];

  @OneToMany(() => GoodSkuPrice, priceInfo => priceInfo.sku)
  priceInfo: GoodSkuPrice[];

  stockInfo: GoodSkuStock;
}