import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { OrderSettle } from './order-settle.entity';
import { SkuDetailVo } from './sku-detail-vo.entity';
import { CouponInfo } from './coupon-info.entity';

@Entity('store_goods')
export class StoreGoods {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  storeId: string; // '1000'

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  storeName: string; // '云Mall深圳旗舰店'

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  remark: string; // null

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(0)
  goodsCount: number; // 1

  @Column({ type: 'varchar', length: 50, default: '0' })
  @IsString()
  deliveryFee: string; // '0'

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  deliveryWords: string; // null

  @Column({ type: 'varchar', length: 50, default: '0' })
  @IsString()
  storeTotalAmount: string; // '0'

  @Column({ type: 'varchar', length: 50, default: '179997' })
  @IsString()
  storeTotalPayAmount: string; // '179997'

  @Column({ type: 'varchar', length: 50, default: '110000' })
  @IsString()
  storeTotalDiscountAmount: string; // '110000'

  @Column({ type: 'varchar', length: 50, default: '0' })
  @IsString()
  storeTotalCouponAmount: string; // '0'

  @Column({ type: 'int' })
  @IsNumber()
  @Min(0)
  orderSettleId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @ManyToOne(() => OrderSettle, orderSettle => orderSettle.storeGoodsList)
  @JoinColumn({ name: 'order_settle_id' })
  orderSettle: OrderSettle;

  @OneToMany(() => SkuDetailVo, skuDetailVo => skuDetailVo.storeGoods)
  skuDetailVos: SkuDetailVo[];

  @OneToMany(() => CouponInfo, couponInfo => couponInfo.storeGoods)
  couponList: CouponInfo[];
}