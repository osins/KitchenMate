import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { GoodSpec } from './good-spec.entity';
import { GoodSku } from './good-sku.entity';

@Entity('good_spec_values')
export class GoodSpecValue {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  saasId: string;

  @Column({ type: 'int'})
  @IsNumber()
  goodId: number;

  @Column({ type: 'int'})
  @IsNumber()
  skuId: number;

  @Column({ type: 'varchar', length: 50})
  @IsOptional()
  @IsString()
  specId: number;

  @Column({ type: 'varchar', length: 50 , unique: true })
  @IsString()
  specValueId: string;

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

  @ManyToOne(() => GoodSpec, goodSpec => goodSpec.specValueList)
  @JoinColumn({ name: 'specId' })
  spec: GoodSpec;

  @OneToMany(() => GoodSku, sku => sku.priceInfo)
  @JoinColumn({ name: 'skuId', referencedColumnName: 'id'})
  sku: GoodSku[];
}