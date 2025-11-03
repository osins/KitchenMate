import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { RightsGoodsInfo } from './rights-goods-info.entity';

@Entity('rights_spec_infos')
export class RightsSpecInfo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  specId: string; // '50456'

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  specTitle: string; // '颜色'

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  specValue: string; // '黑色'

  @Column({ type: 'int' })
  @IsNumber()
  goodsInfoId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @ManyToOne(() => RightsGoodsInfo, goodsInfo => goodsInfo.specInfos)
  @JoinColumn({ name: 'goods_info_id' })
  goodsInfo: RightsGoodsInfo;
}