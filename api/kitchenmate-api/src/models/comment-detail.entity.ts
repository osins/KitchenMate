import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { SubmitCommentItem } from './submit-comment-item.entity';

@Entity('comment_details')
export class CommentDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  image: string; // '图片URL'

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  title: string; // '标题'

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
  @OneToOne(() => SubmitCommentItem, submitCommentItem => submitCommentItem.detail)
  submitCommentItem: SubmitCommentItem;
}