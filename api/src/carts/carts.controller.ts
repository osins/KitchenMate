import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartsService } from './carts.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
@UseGuards(AuthGuard('jwt'))
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  async getUserCart(@Req() req: any) {
    const cartItems = await this.cartsService.getUserCart(req.user.id);
    return {
      success: true,
      data: cartItems,
    };
  }

  @Get('total')
  async getCartTotal(@Req() req: any) {
    const total = await this.cartsService.getCartTotal(req.user.id);
    return {
      success: true,
      data: total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addToCart(@Req() req: any, @Body() addToCartDto: AddToCartDto) {
    const cartItem = await this.cartsService.addToCart(req.user.id, addToCartDto);
    return {
      success: true,
      message: '商品已添加到购物车',
      data: cartItem,
    };
  }

  @Put(':id')
  async updateCartItem(@Req() req: any, @Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    const cartItem = await this.cartsService.updateCartItem(req.user.id, parseInt(id), updateCartDto);
    return {
      success: true,
      message: '购物车项已更新',
      data: cartItem,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removeFromCart(@Req() req: any, @Param('id') id: string) {
    const result = await this.cartsService.removeFromCart(req.user.id, parseInt(id));
    return {
      success: true,
      message: result.message,
    };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearCart(@Req() req: any) {
    const result = await this.cartsService.clearCart(req.user.id);
    return {
      success: true,
      message: result.message,
    };
  }
}