import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from '../common/snowflake/snowflake.service';

@Entity('count_datas')
export class CountData {
  @PrimaryColumn({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH })
  id: string;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  num: number;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  type: string; // 'point', 'coupon'

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}