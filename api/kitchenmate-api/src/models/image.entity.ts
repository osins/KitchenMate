import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Good } from './good.entity';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from 'src/common/snowflake/snowflake.service';

@Entity('images')
export class Image {
  @PrimaryColumn({type:'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH})
  id: number;

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  url: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  type?: string; // 'primary', 'gallery', 'desc' etc.

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH, nullable: true })
  @IsOptional()
  @IsString()
  subjectId?: string;

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