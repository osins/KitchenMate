import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { IsString, IsPhoneNumber, IsDateString } from 'class-validator';

@Entity('verification_codes')
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  @IsPhoneNumber('CN')
  mobile: string;

  @Column({ type: 'varchar', length: 10 })
  @IsString()
  code: string;  // 验证码

  @Column({ type: 'timestamp' })
  expiresAt: Date;  // 过期时间

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;
}