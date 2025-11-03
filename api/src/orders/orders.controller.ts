import { Controller, Get, Post, Body, Param, UseGuards, Req, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getUserOrders(@Req() req: any, @Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const orders = await this.ordersService.getUserOrders(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );
    return {
      success: true,
      data: orders,
    };
  }

  @Get(':id')
  async getOrder(@Req() req: any, @Param('id') id: string) {
    const order = await this.ordersService.getOrder(req.user.id, parseInt(id));
    return {
      success: true,
      data: order,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.createOrder(req.user.id, createOrderDto);
    return {
      success: true,
      message: '订单创建成功',
      data: order,
    };
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelOrder(@Req() req: any, @Param('id') id: string) {
    const order = await this.ordersService.cancelOrder(req.user.id, parseInt(id));
    return {
      success: true,
      message: '订单取消成功',
      data: order,
    };
  }

  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmOrder(@Req() req: any, @Param('id') id: string) {
    const order = await this.ordersService.confirmOrder(req.user.id, parseInt(id));
    return {
      success: true,
      message: '订单确认成功',
      data: order,
    };
  }

  @Get('stats/summary')
  async getOrderStats(@Req() req: any) {
    const stats = await this.ordersService.getOrderStats(req.user.id);
    return {
      success: true,
      data: stats,
    };
  }
}