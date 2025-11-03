import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { Activity } from './activity.entity';

@Entity('activity_ladders')
export class ActivityLadder {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  label: string; // '满100元减99.9元'

  @Column({ type: 'int' })
  @IsNumber()
  activityId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 关系
  @ManyToOne(() => Activity, activity => activity.ladders)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;
}