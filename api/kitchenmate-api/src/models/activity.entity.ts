import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { ActivityLadder } from './activity-ladder.entity';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from '../common/snowflake/snowflake.service';

@Entity('activities')
export class Activity {
  @PrimaryColumn({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  promotionId: string; // 促销ID

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  title: string; // 标题

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  description: string; // 描述

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  promotionCode: string; // 促销代码

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  promotionSubCode: string; // 促销子代码

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  tag: string; // 标签

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  timeType: number; // 时间类型

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  startTime: string; // 开始时间

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  endTime: string; // 结束时间

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  teasingStartTime: string; // 预告开始时间

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @OneToMany(() => ActivityLadder, activityLadder => activityLadder.activity)
  ladders: ActivityLadder[];
}