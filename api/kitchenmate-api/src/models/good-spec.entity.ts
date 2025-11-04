import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { Good } from './good.entity';
import { GoodSpecValue } from './good-spec-value.entity';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from 'src/common/snowflake/snowflake.service';

@Entity('good_specs')
export class GoodSpec {
  @PrimaryColumn({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH })
  id: string;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH})
  @IsString()
  goodId: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  specId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  title: string; // '颜色', '尺码'

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  @ManyToOne(() => Good, good => good.specList)
  @JoinColumn({ name: 'goodId' })
  good: Good;

  @OneToMany(() => GoodSpecValue, specValue => specValue.spec)
  specValueList: GoodSpecValue[];
}