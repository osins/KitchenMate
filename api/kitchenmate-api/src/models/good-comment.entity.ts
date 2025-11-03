import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { SubmitCommentItem } from './submit-comment-item.entity';

@Entity('good_comments')
export class GoodComment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rate: number; // 评价分数 0-5

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  label: string; // '评价内容'

  @Column('simple-array', { nullable: true })
  @IsOptional()
  @IsArray()
  images: string[]; // 图片列表

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
  @OneToOne(() => SubmitCommentItem, submitCommentItem => submitCommentItem.goodComment)
  submitCommentItem: SubmitCommentItem;
}