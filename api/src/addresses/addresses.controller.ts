import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
@UseGuards(AuthGuard('jwt'))
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async getUserAddresses(@Req() req: any) {
    const addresses = await this.addressesService.getUserAddresses(req.user.id);
    return {
      success: true,
      data: addresses,
    };
  }

  @Get(':id')
  async getAddress(@Req() req: any, @Param('id') id: string) {
    const address = await this.addressesService.getAddress(req.user.id, parseInt(id));
    return {
      success: true,
      data: address,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAddress(@Req() req: any, @Body() createAddressDto: CreateAddressDto) {
    const address = await this.addressesService.createAddress(req.user.id, createAddressDto);
    return {
      success: true,
      message: '地址创建成功',
      data: address,
    };
  }

  @Put(':id')
  async updateAddress(@Req() req: any, @Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    const address = await this.addressesService.updateAddress(req.user.id, parseInt(id), updateAddressDto);
    return {
      success: true,
      message: '地址更新成功',
      data: address,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteAddress(@Req() req: any, @Param('id') id: string) {
    await this.addressesService.deleteAddress(req.user.id, parseInt(id));
    return {
      success: true,
      message: '地址删除成功',
    };
  }

  @Post(':id/set-default')
  @HttpCode(HttpStatus.OK)
  async setDefaultAddress(@Req() req: any, @Param('id') id: string) {
    await this.addressesService.setDefaultAddress(req.user.id, parseInt(id));
    return {
      success: true,
      message: '默认地址设置成功',
    };
  }
}