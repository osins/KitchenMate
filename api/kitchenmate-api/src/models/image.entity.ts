import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Good } from './good.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  url: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  type?: string; // 'primary', 'gallery', 'desc' etc.

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  subjectId?: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}