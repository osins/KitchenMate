import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('sku_price_infos')
export class SkuPriceInfo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  @IsNumber()
  @Min(0)
  priceType: number; // 1, 2

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  price: string; // '29800', '40000'

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  priceTypeName: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}