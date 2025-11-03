import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { Rights } from './rights.entity';
import { RightsSpecInfo } from './rights-spec-info.entity';

@Entity('rights_goods_infos')
export class RightsGoodsInfo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  goodsName: string; // '商品名'

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  skuImage: string; // 'SKU图片'

  @Column({ type: 'int' })
  @IsNumber()
  rightsId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @OneToMany(() => RightsSpecInfo, rightsSpecInfo => rightsSpecInfo.goodsInfo)
  specInfos: RightsSpecInfo[];

  @OneToOne(() => Rights, rights => rights.goodsInfo)
  rights: Rights;
}