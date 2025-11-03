import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max } from 'class-validator';
import { GoodSku } from './good-sku.entity';

@Entity('price_infos')
export class PriceInfo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  @IsNumber()
  @Min(1)
  priceType: number;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  price: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  priceTypeName?: string;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  skuId: number;

  // 关联SKU
  @ManyToOne(() => GoodSku, sku => sku.priceInfos)
  @JoinColumn({ name: 'sku_id' })
  sku: GoodSku;
}