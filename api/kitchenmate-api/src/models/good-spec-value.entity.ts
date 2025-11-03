import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { GoodSpec } from './good-spec.entity';
import { GoodSkuSpec } from './good-sku-spec.entity';

@Entity('good_spec_values')
export class GoodSpecValue {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  specValueId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  specId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  saasId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  specValue: string; // '米色荷叶边', 'S', 'M', 'L'

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  image: string;

  @Column({ type: 'int' })
  @IsNumber()
  specIdNumber: number; // 关联到 GoodSpec 表

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  @ManyToOne(() => GoodSpec, goodSpec => goodSpec.specValues)
  @JoinColumn({ name: 'spec_id' })
  spec: GoodSpec;

  @OneToMany(() => GoodSkuSpec, skuSpec => skuSpec.specValue)
  skuSpecs: GoodSkuSpec[];
}