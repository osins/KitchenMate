import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class PhoneLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('CN')  // 验证中国手机号格式
  mobile: string;

  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}