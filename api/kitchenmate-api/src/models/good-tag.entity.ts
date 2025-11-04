import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { Good } from './good.entity';

@Entity('good_tags')
export class GoodTag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  tagId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  title: string; // '限时抢购'

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  image: string;

  @Column({ type: 'int' })
  @IsNumber()
  goodId: number;

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