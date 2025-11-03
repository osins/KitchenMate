import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'phone', 'avatarUrl', 'isActive', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查用户名是否已被其他用户使用
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      
      if (existingUser && existingUser.id !== id) {
        throw new NotFoundException('用户名已被使用');
      }
    }

    // 更新用户信息
    Object.assign(user, updateUserDto);
    
    await this.userRepository.save(user);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
    };
  }

  async deactivateUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    user.isActive = false;
    await this.userRepository.save(user);

    return { message: '用户已停用' };
  }

  async getUserStats(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders', 'addresses', 'cartItems'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        lastLogin: user.lastLogin,
      },
      stats: {
        totalOrders: user.orders?.length || 0,
        totalAddresses: user.addresses?.length || 0,
        cartItemsCount: user.cartItems?.length || 0,
      },
    };
  }
}