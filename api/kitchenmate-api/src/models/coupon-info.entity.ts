import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { StoreGoods } from './store-goods.entity';

@Entity('coupon_infos')
export class CouponInfo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  @IsNumber()
  @Min(0)
  couponId: number; // 11

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  storeId: string; // '1000'

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
  @ManyToOne(() => StoreGoods, storeGoods => storeGoods.couponList)
  @JoinColumn({ name: 'store_goods_id' })
  storeGoods: StoreGoods;
}