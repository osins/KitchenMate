import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from '../common/snowflake/snowflake.service';

@Entity('apply_reasons')
export class ApplyReason {
  @PrimaryColumn({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  reasonId: string; // '1'

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  desc: string; // '实际商品与描述不符'

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}