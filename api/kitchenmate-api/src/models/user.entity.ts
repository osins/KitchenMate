import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray, IsPhoneNumber } from 'class-validator';
import { DEFAULT_SNOWFLAKE_ID_LENGTH } from '../common/snowflake/snowflake.service';
import { GoodComment } from './good-comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({type:'bigint'})
  id: number;

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH, nullable: true })
  @IsOptional()
  @IsString()
  openid?: string;  // 微信用户唯一标识

  @Column({ type: 'varchar', length: DEFAULT_SNOWFLAKE_ID_LENGTH, nullable: true })
  @IsOptional()
  @IsString()
  unionid?: string;  // 微信用户开放平台唯一标识

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  mobile?: string;  // 手机号，使用mobile替代phone

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  nickname?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })  // 密码字段
  @IsOptional()
  @IsString()
  password?: string;  // 加密后的密码

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  @Max(2)
  gender: number;  // 0未知，1男，2女

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  province?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })  // 纬度，范围-90到90
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })  // 经度，范围-180到180
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Column({ type: 'varchar', length: 50, default: 'wechat' })  // 登录类型：wechat, phone, both
  @IsString()
  loginType: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;


}