import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartsService } from '../carts/carts.service';
import { ProductsService } from '../products/products.service';
import { AddressesService } from '../addresses/addresses.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartsService: CartsService,
    private readonly productsService: ProductsService,
    private readonly addressesService: AddressesService,
  ) {}

  async getUserOrders(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getOrder(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['items', 'items.product', 'address'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    // 验证地址
    const address = await this.addressesService.getAddress(userId, createOrderDto.addressId);
    if (!address) {
      throw new BadRequestException('地址不存在');
    }

    // 获取用户购物车
    const cartItems = await this.cartsService.getUserCart(userId);
    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('购物车为空');
    }

    // 计算总金额
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const cartItem of cartItems) {
      const product = await this.productsService.findOne(cartItem.product.id);
      if (!product) {
        throw new BadRequestException(`商品不存在: ${cartItem.product.id}`);
      }

      if (product.stock < cartItem.quantity) {
        throw new BadRequestException(`商品库存不足: ${product.name}`);
      }

      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      const orderItem = this.orderItemRepository.create({
        product: product,
        productName: product.name,
        price: product.price,
        quantity: cartItem.quantity,
      });

      orderItems.push(orderItem);

      // 更新商品库存
      await this.productsService.update(product.id, {
        stock: product.stock - cartItem.quantity,
      });
    }

    // 创建订单
    const order = this.orderRepository.create({
      user: { id: userId },
      shippingAddress: address,
      totalAmount,
      status: OrderStatus.PENDING,
      items: orderItems,
    });

    const savedOrder = await this.orderRepository.save(order);

    // 清空购物车
    await this.cartsService.clearCart(userId);

    return savedOrder;
  }

  async cancelOrder(userId: number, orderId: number) {
    const order = await this.getOrder(userId, orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('只能取消待处理的订单');
    }

    // 恢复商品库存
    for (const item of order.items) {
      const product = await this.productsService.findOne(item.product.id);
      if (product) {
        await this.productsService.update(product.id, {
          stock: product.stock + item.quantity,
        });
      }
    }

    order.status = OrderStatus.CANCELLED;
    return await this.orderRepository.save(order);
  }

  async confirmOrder(userId: number, orderId: number) {
    const order = await this.getOrder(userId, orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('只能确认待处理的订单');
    }

    order.status = OrderStatus.PAID;
    return await this.orderRepository.save(order);
  }

  async getOrderStats(userId: number) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
    });

    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
      paid: orders.filter(o => o.status === OrderStatus.PAID).length,
      shipped: orders.filter(o => o.status === OrderStatus.SHIPPED).length,
      delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
      cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
      refunded: orders.filter(o => o.status === OrderStatus.REFUNDED).length,
      totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    };

    return stats;
  }
}