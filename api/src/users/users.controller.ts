import { Controller, Get, Put, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findById(req.user.id);
    return {
      success: true,
      data: user,
    };
  }

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.updateProfile(req.user.id, updateUserDto);
    return {
      success: true,
      message: '用户信息更新成功',
      data: user,
    };
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(parseInt(id));
    return {
      success: true,
      data: user,
    };
  }

  @Delete('deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateUser(@Req() req: any) {
    const result = await this.usersService.deactivateUser(req.user.id);
    return {
      success: true,
      message: result.message,
    };
  }

  @Get('profile/stats')
  async getUserStats(@Req() req: any) {
    const result = await this.usersService.getUserStats(req.user.id);
    return {
      success: true,
      data: result,
    };
  }
}