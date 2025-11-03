import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly productsService: ProductsService,
  ) {}

  async getUserCart(userId: number) {
    return await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'product.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    // 检查商品是否存在且有库存
    const product = await this.productsService.findOne(addToCartDto.productId);
    
    if (product.stock < addToCartDto.quantity) {
      throw new BadRequestException('库存不足');
    }

    // 检查购物车是否已有该商品
    let cartItem = await this.cartRepository.findOne({
      where: { 
        user: { id: userId }, 
        product: { id: addToCartDto.productId } 
      },
      relations: ['product'],
    });

    if (cartItem) {
      // 更新数量
      cartItem.quantity += addToCartDto.quantity;
      
      // 检查库存是否足够
      if (cartItem.quantity > product.stock) {
        throw new BadRequestException('库存不足');
      }
    } else {
      // 创建新的购物车项
      cartItem = this.cartRepository.create({
        user: { id: userId },
        product: { id: addToCartDto.productId },
        quantity: addToCartDto.quantity,
      });
    }

    await this.cartRepository.save(cartItem);
    
    // 重新加载完整信息
    return await this.cartRepository.findOne({
      where: { id: cartItem.id },
      relations: ['product', 'product.category'],
    });
  }

  async updateCartItem(userId: number, cartItemId: number, updateCartDto: UpdateCartDto) {
    const cartItem = await this.cartRepository.findOne({
      where: { 
        id: cartItemId, 
        user: { id: userId } 
      },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('购物车项不存在');
    }

    // 如果更新数量，检查库存
    if (updateCartDto.quantity !== undefined) {
      if (updateCartDto.quantity < 1) {
        throw new BadRequestException('数量不能小于1');
      }
      
      if (updateCartDto.quantity > cartItem.product.stock) {
        throw new BadRequestException('库存不足');
      }
      
      cartItem.quantity = updateCartDto.quantity;
    }

    if (updateCartDto.isSelected !== undefined) {
      cartItem.isSelected = updateCartDto.isSelected;
    }

    await this.cartRepository.save(cartItem);
    
    return await this.cartRepository.findOne({
      where: { id: cartItem.id },
      relations: ['product', 'product.category'],
    });
  }

  async removeFromCart(userId: number, cartItemId: number) {
    const cartItem = await this.cartRepository.findOne({
      where: { 
        id: cartItemId, 
        user: { id: userId } 
      },
    });

    if (!cartItem) {
      throw new NotFoundException('购物车项不存在');
    }

    await this.cartRepository.remove(cartItem);
    
    return { message: '购物车项已删除' };
  }

  async clearCart(userId: number) {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
    });

    await this.cartRepository.remove(cartItems);
    
    return { message: '购物车已清空' };
  }

  async getCartTotal(userId: number) {
    const cartItems = await this.getUserCart(userId);
    
    let total = 0;
    let selectedTotal = 0;
    let itemCount = cartItems.length;
    let selectedCount = 0;

    for (const item of cartItems) {
      const itemTotal = item.quantity * item.product.price;
      total += itemTotal;
      
      if (item.isSelected) {
        selectedTotal += itemTotal;
        selectedCount++;
      }
    }

    return {
      total,
      selectedTotal,
      itemCount,
      selectedCount,
    };
  }
}