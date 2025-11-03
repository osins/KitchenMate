import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('searches')
export class Search {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('simple-array')
  @IsArray()
  historyWords: string[]; // ['历史搜索词数组']

  @Column('simple-array')
  @IsArray()
  popularWords: string[]; // ['热门搜索词数组']

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  saasId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  storeId: string;

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(1)
  pageNum: number;

  @Column({ type: 'int', default: 30 })
  @IsNumber()
  @Min(1)
  pageSize: number;

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(0)
  totalCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}