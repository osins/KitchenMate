import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { PromotionItem } from './promotion-item.entity';

@Entity('promotion_tags')
export class PromotionTag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  title: string; // 标签名

  @Column({ type: 'int' })
  @IsNumber()
  promotionItemId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @ManyToOne(() => PromotionItem, promotionItem => promotionItem.tags)
  @JoinColumn({ name: 'promotion_item_id' })
  promotionItem: PromotionItem;
}