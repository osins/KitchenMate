import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min } from 'class-validator';
import { GoodSku } from './good-sku.entity';
import { GoodSpec } from './good-spec.entity';
import { GoodSpecValue } from './good-spec-value.entity';

@Entity('good_sku_specs')
export class GoodSkuSpec {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  @IsNumber()
  skuId: number;

  @Column({ type: 'int' })
  @IsNumber()
  specId: number;

  @Column({ type: 'int' })
  @IsNumber()
  specValueId: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  @ManyToOne(() => GoodSku, sku => sku.skuSpecs)
  @JoinColumn({ name: 'sku_id' })
  sku: GoodSku;

  @ManyToOne(() => GoodSpec, spec => spec.skuSpecs)
  @JoinColumn({ name: 'spec_id' })
  spec: GoodSpec;

  @ManyToOne(() => GoodSpecValue, specValue => specValue.skuSpecs)
  @JoinColumn({ name: 'spec_value_id' })
  specValue: GoodSpecValue;
}