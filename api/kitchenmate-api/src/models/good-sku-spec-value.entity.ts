import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from 'src/common/snowflake/snowflake.service';
import { GoodSpec } from './good-spec.entity';
import { GoodSku } from './good-sku.entity';

@Entity('good_sku_spec_values')
export class GoodSkuSpecValue {
  @PrimaryColumn({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH })
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  saasId: string;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH})
  @IsString()
  goodId: string;
  
  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH, nullable: true})
  @IsString()
  skuId: string;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH, nullable: true })
  @IsOptional()
  @IsString()
  specId: string;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH})
  @IsString()
  specValueId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  specValue: string; // '米色荷叶边', 'S', 'M', 'L'

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  image: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  @ManyToOne(() => GoodSku, sku => sku.specInfo)
  @JoinColumn({ name: 'skuId', referencedColumnName: 'skuId'})
  sku: GoodSku;
}