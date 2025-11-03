import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('comment_resources')
export class CommentResource {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  src: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  type: string; // 'image', 'video'

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  coverSrc: string; // 仅视频类型有

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}