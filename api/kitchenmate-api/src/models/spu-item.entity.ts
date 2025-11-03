import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('spu_items')
export class SpuItem {
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
  primaryImage: string;

  @Column('simple-array', { nullable: true })
  @IsOptional()
  @IsArray()
  images: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  video: string;

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

  @Column('simple-array', { nullable: true })
  @IsOptional()
  @IsArray()
  categoryIds: string[];

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  desc: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  etitle: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}