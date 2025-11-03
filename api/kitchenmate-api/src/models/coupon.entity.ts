import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  key: string;

  @Column({ type: 'varchar', length: 20, default: 'default' })
  @IsString()
  status: string; // 'default', 'useless', 'disabled'

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(1)
  @Max(2)
  type: number; // 1 or 2

  @Column({ type: 'int', default: 1800 })
  @IsNumber()
  @Min(0)
  value: number; // 折扣或者满减值

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  tag: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  desc: string; // 描述

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  base: number; // 订单底价,满n元

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  title: string; // 标题

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  timeLimit: string; // 有效时间限制

  @Column({ type: 'varchar', length: 10, default: '¥' })
  @IsString()
  currency: string; // 货币符号

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}