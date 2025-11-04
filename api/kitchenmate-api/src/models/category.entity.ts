import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from 'src/common/snowflake/snowflake.service';

@Entity('categories')
export class Category {
  @PrimaryColumn({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH })
  id: string;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH ,nullable: true })
  @IsOptional()
  @IsString()
  parentId: string;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH })
  @IsString()
  groupId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  thumbnail: string;

  @Column({ type: 'boolean', default: true })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;

  // 自引用关系
  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];
}