import { Controller, Post, Body, Get, UseGuards, Req, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerificationService } from './verification.service';
import { WechatLoginDto } from './dto/wechat-login.dto';
import { PhoneLoginDto } from './dto/phone-login.dto';
import { PasswordLoginDto } from './dto/password-login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendVerificationDto } from './dto/send-verification.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { User } from '../models/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private verificationService: VerificationService,
  ) {}

  @Post('wechat-login')
  async wechatLogin(@Body() dto: WechatLoginDto) {
    return this.authService.wechatLogin(dto);
  }

  @Post('phone-login')
  async phoneLogin(@Body() dto: PhoneLoginDto) {
    return this.authService.phoneLogin(dto);
  }

  @Post('password-login')
  async passwordLogin(@Body() dto: PasswordLoginDto) {
    return this.authService.passwordLogin(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('send-verification')
  async sendVerification(@Body() dto: SendVerificationDto) {
    await this.verificationService.sendVerificationCode(dto.mobile);
    return { message: 'Verification code sent successfully' };
  }

  @Get('user-info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req) {
    return this.authService.getUserInfo(req.user.userId);
  }

  @Put('user-info')
  @UseGuards(JwtAuthGuard)
  async updateUserInfo(@Req() req, @Body() dto: UpdateUserInfoDto) {
    const updatedUser = await this.authService.updateUserInfo(req.user.userId, {
      nickname: dto.nickname,
      avatar: dto.avatar,
      gender: dto.gender,
      city: dto.city,
      province: dto.province,
      country: dto.country,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
    
    return { message: 'User info updated successfully', user: updatedUser };
  }

  @Post('bind-phone')
  @UseGuards(JwtAuthGuard)
  async bindPhone(@Req() req, @Body() body: { mobile: string; verificationCode: string }) {
    return this.authService.bindPhone(req.user.userId, body.mobile, body.verificationCode);
  }
}