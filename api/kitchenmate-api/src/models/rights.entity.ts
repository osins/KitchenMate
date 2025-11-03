import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { RightsGoodsInfo } from './rights-goods-info.entity';

@Entity('rights')
export class Rights {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, default: '88888888' })
  @IsString()
  saasId: string; // '88888888'

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  uid: string; // '用户ID'

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  storeId: string; // '1000'

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  skuId: string; // 'SKU ID'

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(0)
  numOfSku: number; // 1

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  refundableAmount: string; // '26900'

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  orderNo: string; // '订单号'

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @OneToOne(() => RightsGoodsInfo, rightsGoodsInfo => rightsGoodsInfo.rights)
  @JoinColumn()
  goodsInfo: RightsGoodsInfo;
}