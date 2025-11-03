import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { StoreGoods } from './store-goods.entity';

@Entity('sku_detail_vos')
export class SkuDetailVo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  storeId: string; // '1000'

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  spuId: string; // 'SPU ID'

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  skuId: string; // 'SKU ID'

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  goodsName: string; // '商品名'

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  image: string; // '图片URL'

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(0)
  quantity: number; // 1

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  payPrice: string; // '价格'

  @Column({ type: 'int' })
  @IsNumber()
  @Min(0)
  storeGoodsId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @ManyToOne(() => StoreGoods, storeGoods => storeGoods.skuDetailVos)
  @JoinColumn({ name: 'store_goods_id' })
  storeGoods: StoreGoods;
}