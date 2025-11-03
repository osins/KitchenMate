import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { Promotion } from './promotion.entity';
import { PromotionTag } from './promotion-tag.entity';

@Entity('promotion_items')
export class PromotionItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  spuId: string; // 商品ID

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  thumb: string; // 缩略图

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  title: string; // 标题

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  price: string; // 价格

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  originPrice: string; // 原价

  @Column({ type: 'int' })
  @IsNumber()
  promotionId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @ManyToOne(() => Promotion, promotion => promotion.items)
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @OneToMany(() => PromotionTag, promotionTag => promotionTag.promotionItem)
  tags: PromotionTag[];
}