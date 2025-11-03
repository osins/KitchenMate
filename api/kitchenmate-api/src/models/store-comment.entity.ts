import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { SubmitComment } from './submit-comment.entity';

@Entity('store_comments')
export class StoreComment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  @Max(5)
  logisticsRate: number; // 物流评分 0-5

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  @Max(5)
  servicesRate: number; // 服务评分 0-5

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
  @OneToOne(() => SubmitComment, submitComment => submitComment.storeComment)
  submitComment: SubmitComment;
}