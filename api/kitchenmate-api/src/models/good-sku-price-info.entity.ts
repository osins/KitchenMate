import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max } from 'class-validator';
import { GoodSku } from './good-sku.entity';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from 'src/common/snowflake/snowflake.service';

@Entity('good_sku_prices')
export class GoodSkuPrice {
  @PrimaryColumn({type:'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH})
  id: string;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH, nullable: true })
  @IsString()
  goodId: string;

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

  @Column({ type: 'varchar',length: DEFAULT_SNOWFLAKE_ID_LENGTH, nullable: true })
  @IsOptional()
  @IsString()
  skuId: string;

  // 关联SKU
  @ManyToOne(() => GoodSku, sku => sku.priceInfo)
  @JoinColumn({ name: 'skuId' })
  sku: GoodSku;
}