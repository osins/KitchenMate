import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { SubmitCommentItem } from './submit-comment-item.entity';

@Entity('check_items')
export class CheckItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  name: string; // '匿名评价'

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  value: string; // 'anonymous'

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  checked: boolean; // false

  @Column({ type: 'int' })
  @IsNumber()
  @Min(0)
  submitCommentItemId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @ManyToOne(() => SubmitCommentItem, submitCommentItem => submitCommentItem.checkItems)
  @JoinColumn({ name: 'submit_comment_item_id' })
  submitCommentItem: SubmitCommentItem;
}