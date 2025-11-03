import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('user_infos')
export class UserInfo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  avatarUrl: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  nickName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @Column({ type: 'int', default: 2 })
  @IsNumber()
  @Min(0)
  @Max(2)
  gender: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}