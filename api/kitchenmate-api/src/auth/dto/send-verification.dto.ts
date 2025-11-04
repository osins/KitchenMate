import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SendVerificationDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('CN')  // 验证中国手机号格式
  mobile: string;
}