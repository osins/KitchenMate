import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { PromotionItem } from './promotion-item.entity';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  banner: string; // 横幅图片URL

  @Column({ type: 'bigint' })
  @IsNumber()
  @Min(0)
  time: number; // 剩余时间 (毫秒)

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  showBannerDesc: boolean; // 显示横幅描述

  @Column({ type: 'varchar', length: 20, default: 'running' })
  @IsString()
  statusTag: string; // 状态标签

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @OneToMany(() => PromotionItem, promotionItem => promotionItem.promotion)
  items: PromotionItem[];
}