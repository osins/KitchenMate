import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from 'src/common/snowflake/snowflake.service';
import { GoodSpec } from './good-spec.entity';
import { GoodSku } from './good-sku.entity';

@Entity('good_spec_values')
export class GoodSpecValue {
  @PrimaryColumn({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH })
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  saasId: string;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH})
  @IsString()
  goodId: string;
  
  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH})
  @IsString()
  skuId: string;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH})
  @IsOptional()
  @IsString()
  specId: string;

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