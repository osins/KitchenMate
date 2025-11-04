import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from '../common/snowflake/snowflake.service';

@Entity('button_vos')
export class ButtonVO {
  @PrimaryColumn({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH })
  id: string;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  primary: boolean;

  @Column({ type: 'int' })
  @IsNumber()
  @Min(0)
  type: number;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}