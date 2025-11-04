import { IsString, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('CN')  // 验证中国手机号格式
  mobile: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)  // 密码至少6位
  password: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;
}