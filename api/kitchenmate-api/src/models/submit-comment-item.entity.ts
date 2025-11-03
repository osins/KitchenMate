import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { SubmitComment } from './submit-comment.entity';
import { CheckItem } from './check-item.entity';
import { CommentDetail } from './comment-detail.entity';
import { GoodComment } from './good-comment.entity';

@Entity('submit_comment_items')
export class SubmitCommentItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  squid: string; // '1' SKU ID

  @Column({ type: 'int' })
  @IsNumber()
  @Min(0)
  submitCommentId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @ManyToOne(() => SubmitComment, submitComment => submitComment.goods)
  @JoinColumn({ name: 'submit_comment_id' })
  submitComment: SubmitComment;

  @OneToMany(() => CheckItem, checkItem => checkItem.submitCommentItem)
  checkItems: CheckItem[];

  @OneToOne(() => CommentDetail, commentDetail => commentDetail.submitCommentItem)
  @JoinColumn()
  detail: CommentDetail;

  @OneToOne(() => GoodComment, goodComment => goodComment.submitCommentItem)
  @JoinColumn()
  goodComment: GoodComment;
}