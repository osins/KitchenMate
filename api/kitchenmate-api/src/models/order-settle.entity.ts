import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { StoreGoods } from './store-goods.entity';

@Entity('order_settles')
export class OrderSettle {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  @Max(1)
  settleType: number; // 0

  @Column({ type: 'int', default: 3 })
  @IsNumber()
  @Min(0)
  @Max(10)
  totalGoodsCount: number; // 3

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(0)
  @Max(10)
  packageCount: number; // 1

  @Column({ type: 'varchar', length: 50, default: '289997' })
  @IsString()
  totalAmount: string; // '289997'

  @Column({ type: 'varchar', length: 50, default: '' })
  @IsString()
  totalPayAmount: string; // ''

  @Column({ type: 'varchar', length: 50, default: '110000' })
  @IsString()
  totalDiscountAmount: string; // '110000'

  @Column({ type: 'varchar', length: 50, default: '1100' })
  @IsString()
  totalPromotionAmount: string; // '1100'

  @Column({ type: 'varchar', length: 50, default: '0' })
  @IsString()
  totalCouponAmount: string; // '0'

  @Column({ type: 'varchar', length: 50, default: '289997' })
  @IsString()
  totalSalePrice: string; // '289997'

  @Column({ type: 'varchar', length: 50, default: '289997' })
  @IsString()
  totalGoodsAmount: string; // '289997'

  @Column({ type: 'varchar', length: 50, default: '0' })
  @IsString()
  totalDeliveryFee: string; // '0'

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  invoiceSupport: number; // 1

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @OneToMany(() => StoreGoods, storeGoods => storeGoods.orderSettle)
  storeGoodsList: StoreGoods[];
}