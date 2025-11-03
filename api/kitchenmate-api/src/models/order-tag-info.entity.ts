import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('order_tag_infos')
export class OrderTagInfo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  orderNum: number;

  @Column({ type: 'int' })
  @IsNumber()
  tabType: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}