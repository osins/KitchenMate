import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { GoodSpec } from './good-spec.entity';
import { GoodSku } from './good-sku.entity';
import { GoodTag } from './good-tag.entity';

@Entity('goods')
export class Good {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, default: '88888888' })
  @IsString()
  saasId: string;

  @Column({ type: 'varchar', length: 50, default: '1000' })
  @IsString()
  storeId: string;

  @Column({ type: 'varchar', length: 50, default: '0' })
  @IsString()
  spuId: string;

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  primaryImage?: string;

  @Column('simple-array', { nullable: true }) // 存储为逗号分隔的字符串
  @IsOptional()
  @IsArray()
  images?: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  video?: string;

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(0)
  available: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  minSalePrice: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  minLinePrice: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  maxSalePrice: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  maxLinePrice: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  spuStockQuantity: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  soldNum: number;

  @Column({ type: 'tinyint', width: 1, default: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  isPutOnSale: number;

  @Column('simple-array', { nullable: true }) // 存储为逗号分隔的字符串
  @IsOptional()
  @IsArray()
  categoryIds?: string[];

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  desc?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  etitle?: string;

  // limitInfo 字段，对应前端 JSON 中的 limitInfo
  @Column({ type: 'simple-json', nullable: true })
  @IsOptional()
  limitInfo?: any[];

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @OneToMany(() => GoodSpec, goodSpec => goodSpec.good)
  specs: GoodSpec[];

  @OneToMany(() => GoodSku, goodSku => goodSku.good)
  skus: GoodSku[];

  @OneToMany(() => GoodTag, goodTag => goodTag.good)
  tags: GoodTag[];
}