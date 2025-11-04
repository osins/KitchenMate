import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationCode } from '../models/verification-code.entity';

@Injectable()
export class VerificationService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(VerificationCode)
    private verificationCodeRepository: Repository<VerificationCode>,
  ) {}

  async sendVerificationCode(mobile: string): Promise<boolean> {
    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 设置过期时间（10分钟）
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // 检查是否已经发送过验证码（防止频发）
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
    
    const recentCodes = await this.verificationCodeRepository.find({
      where: {
        mobile: mobile,
        createdAt: MoreThan(tenMinutesAgo),
      },
      order: {
        createdAt: 'DESC',
      },
      take: 1,
    });
    
    const recentCode = recentCodes.length > 0 ? recentCodes[0] : null;

    // 如果近期已经发送过验证码，则拒绝发送
    if (recentCode) {
      const timeSinceLastSend = new Date().getTime() - recentCode.createdAt.getTime();
      const secondsSinceLastSend = Math.floor(timeSinceLastSend / 1000);
      if (secondsSinceLastSend < 60) { // 限制每分钟发送一次
        throw new HttpException('Please wait a minute before requesting another code', HttpStatus.TOO_MANY_REQUESTS);
      }
    }

    // 保存验证码到数据库
    const verificationCode = new VerificationCode();
    verificationCode.mobile = mobile;
    verificationCode.code = code;
    verificationCode.expiresAt = expiresAt;

    await this.verificationCodeRepository.save(verificationCode);

    // 在实际应用中，这里应该调用短信服务发送验证码
    // 例如调用阿里云、腾讯云等短信服务
    console.log(`Verification code ${code} sent to ${mobile}`);

    return true;
  }

  async verifyCode(mobile: string, code: string): Promise<boolean> {
    // 查找验证码
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: {
        mobile,
        code,
      },
      order: {
        createdAt: 'DESC', // 获取最新的验证码
      },
    });

    if (!verificationCode) {
      return false;
    }

    // 检查验证码是否过期
    if (new Date() > verificationCode.expiresAt) {
      // 验证码已过期，删除它
      await this.verificationCodeRepository.remove(verificationCode);
      return false;
    }

    // 删除已使用的验证码（一次性的）
    await this.verificationCodeRepository.remove(verificationCode);
    return true;
  }
}