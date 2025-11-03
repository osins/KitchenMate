import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async getUserAddresses(userId: number) {
    return await this.addressRepository.find({
      where: { user: { id: userId } },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async createAddress(userId: number, createAddressDto: CreateAddressDto) {
    // 如果设置为默认地址，取消其他默认地址
    if (createAddressDto.isDefault) {
      await this.addressRepository.update(
        { user: { id: userId }, isDefault: true },
        { isDefault: false }
      );
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      user: { id: userId },
    });

    await this.addressRepository.save(address);
    return address;
  }

  async updateAddress(userId: number, addressId: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('地址不存在');
    }

    // 如果设置为默认地址，取消其他默认地址
    if (updateAddressDto.isDefault && !address.isDefault) {
      await this.addressRepository.update(
        { user: { id: userId }, isDefault: true },
        { isDefault: false }
      );
    }

    Object.assign(address, updateAddressDto);
    await this.addressRepository.save(address);
    
    return address;
  }

  async deleteAddress(userId: number, addressId: number) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('地址不存在');
    }

    await this.addressRepository.remove(address);
    return { message: '地址已删除' };
  }

  async getDefaultAddress(userId: number) {
    return await this.addressRepository.findOne({
      where: { user: { id: userId }, isDefault: true },
    });
  }

  async getAddress(userId: number, addressId: number) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('地址不存在');
    }

    return address;
  }

  async setDefaultAddress(userId: number, addressId: number) {
    // 先取消所有默认地址
    await this.addressRepository.update(
      { user: { id: userId }, isDefault: true },
      { isDefault: false }
    );

    // 设置新的默认地址
    await this.addressRepository.update(
      { id: addressId, user: { id: userId } },
      { isDefault: true }
    );

    return { message: '默认地址设置成功' };
  }
}