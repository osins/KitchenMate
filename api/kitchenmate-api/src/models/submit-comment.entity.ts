import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { SubmitCommentItem } from './submit-comment-item.entity';
import { StoreComment } from './store-comment.entity';

@Entity('submit_comments')
export class SubmitComment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @OneToMany(() => SubmitCommentItem, submitCommentItem => submitCommentItem.submitComment)
  goods: SubmitCommentItem[];

  @OneToOne(() => StoreComment, storeComment => storeComment.submitComment)
  @JoinColumn()
  storeComment: StoreComment;
}