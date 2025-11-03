import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { Good } from './good.entity';
import { GoodSpecValue } from './good-spec-value.entity';
import { GoodSkuSpec } from './good-sku-spec.entity';

@Entity('good_specs')
export class GoodSpec {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  specId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  title: string; // '颜色', '尺码'

  @Column({ type: 'int' })
  @IsNumber()
  goodId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  @ManyToOne(() => Good, good => good.specs)
  @JoinColumn({ name: 'good_id' })
  good: Good;

  @OneToMany(() => GoodSpecValue, specValue => specValue.spec)
  specValues: GoodSpecValue[];

  @OneToMany(() => GoodSkuSpec, skuSpec => skuSpec.spec)
  skuSpecs: GoodSkuSpec[];
}