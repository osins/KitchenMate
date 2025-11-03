import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, IsArray } from 'class-validator';
import { Good } from './good.entity';
import { GoodSkuSpec } from './good-sku-spec.entity';
import { PriceInfo } from './price-info.entity';

@Entity('good_skus')
export class GoodSku {
  @PrimaryGeneratedColumn('increment')
  id: number;

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
  soldQuantity: number;

  @Column({ type: 'int' })
  @IsNumber()
  goodId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  @ManyToOne(() => Good, good => good.skus)
  @JoinColumn({ name: 'good_id' })
  good: Good;

  @OneToMany(() => GoodSkuSpec, skuSpec => skuSpec.sku)
  skuSpecs: GoodSkuSpec[];

  @OneToMany(() => PriceInfo, priceInfo => priceInfo.sku)
  priceInfos: PriceInfo[];
}