import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { Good } from './good.entity';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from 'src/common/snowflake/snowflake.service';

@Entity('good_tags')
export class GoodTag {
  @PrimaryColumn({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH })
  id: string;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH })
  @IsString()
  tagId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  title: string; // '限时抢购'

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  image: string;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH})
  @IsString()
  goodId: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  @ManyToOne(() => Good, good => good.spuTagList)
  @JoinColumn({ name: 'good_id' })
  good?: Good;
}