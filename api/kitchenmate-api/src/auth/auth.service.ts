import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import { WechatLoginDto } from './dto/wechat-login.dto';
import { PhoneLoginDto } from './dto/phone-login.dto';
import { PasswordLoginDto } from './dto/password-login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerificationService } from './verification.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private verificationService: VerificationService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async wechatLogin(dto: WechatLoginDto): Promise<{ user: User; token: string }> {
    // 这里应该调用微信API来验证code并获取用户信息
    // 由于没有真实的服务接口，我们模拟一个流程
    // 在实际应用中，这里应该调用微信的 auth.code2Session 接口

    // 模拟微信API返回的用户信息
    const wechatUserInfo = {
      openid: 'mock_openid_' + Date.now(),
      session_key: 'mock_session_key',
    };

    let user = await this.userRepository.findOne({
      where: { openid: wechatUserInfo.openid },
    });

    if (!user) {
      // 创建新用户
      user = new User();
      user.openid = wechatUserInfo.openid;
      user.loginType = 'wechat';
      user.createdAt = new Date();
      user.updatedAt = new Date();
    }

    // 更新最后登录时间
    user.updatedAt = new Date();
    
    const savedUser = await this.userRepository.save(user);
    const token = this.generateToken(savedUser);

    return { user: savedUser, token };
  }

  async phoneLogin(dto: PhoneLoginDto): Promise<{ user: User; token: string }> {
    // 验证验证码
    const isValid = await this.verificationService.verifyCode(
      dto.mobile,
      dto.verificationCode,
    );

    if (!isValid) {
      throw new HttpException('Invalid verification code', HttpStatus.UNAUTHORIZED);
    }

    // 查找用户
    let user = await this.userRepository.findOne({
      where: { mobile: dto.mobile },
    });

    if (!user) {
      // 创建新用户
      user = new User();
      user.mobile = dto.mobile;
      user.loginType = 'phone';
      user.createdAt = new Date();
    }

    // 更新用户信息
    user.updatedAt = new Date();
    user.loginType = user.loginType.includes('phone') ? user.loginType : `${user.loginType}_phone`;

    const savedUser = await this.userRepository.save(user);
    const token = this.generateToken(savedUser);

    return { user: savedUser, token };
  }

  async passwordLogin(dto: PasswordLoginDto): Promise<{ user: User; token: string }> {
    // 查找用户
    const user = await this.userRepository.findOne({
      where: { mobile: dto.mobile },
    });

    if (!user || !user.password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // 更新最后登录时间
    user.updatedAt = new Date();
    await this.userRepository.save(user);

    const token = this.generateToken(user);
    return { user, token };
  }

  async register(dto: RegisterDto): Promise<{ user: User; token: string }> {
    // 检查手机号是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { mobile: dto.mobile },
    });

    if (existingUser) {
      throw new HttpException('Mobile number already registered', HttpStatus.BAD_REQUEST);
    }

    // 创建新用户
    const user = new User();
    user.mobile = dto.mobile;
    user.nickname = dto.nickname;
    user.password = await bcrypt.hash(dto.password, 10); // 加密密码
    user.loginType = 'password';
    user.createdAt = new Date();
    user.updatedAt = new Date();

    const savedUser = await this.userRepository.save(user);
    const token = this.generateToken(savedUser);

    return { user: savedUser, token };
  }

  async bindPhone(userId: number, mobile: string, verificationCode: string): Promise<User> {
    // 验证验证码
    const isValid = await this.verificationService.verifyCode(
      mobile,
      verificationCode,
    );

    if (!isValid) {
      throw new HttpException('Invalid verification code', HttpStatus.UNAUTHORIZED);
    }

    // 查找用户并更新
    let user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.mobile = mobile;
    if (!user.loginType.includes('phone')) {
      user.loginType = user.loginType ? `${user.loginType}_phone` : 'phone';
    }
    
    return await this.userRepository.save(user);
  }

  private generateToken(user: User): string {
    const payload = { 
      userId: user.id, 
      openid: user.openid, 
      mobile: user.mobile,
      sub: user.id.toString() 
    };
    return this.jwtService.sign(payload, { 
      secret: this.configService.get<string>('JWT_SECRET') || 'default_secret',
      expiresIn: '7d', // Token 有效期为7天
    });
  }

  async getUserInfo(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    return user;
  }

  async updateUserInfo(userId: number, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // 更新用户信息
    Object.assign(user, updateData);
    user.updatedAt = new Date();

    return await this.userRepository.save(user);
  }
}