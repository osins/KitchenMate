import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('sku_stock_infos')
export class SkuStockInfo {
  @PrimaryGeneratedColumn('increment')
  id: number;

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

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}