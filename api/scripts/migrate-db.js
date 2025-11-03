#!/usr/bin/env node

const { DataSource } = require('typeorm');
const config = require('../src/config/database.config');
const bcrypt = require('bcrypt');

// 数据库实体
const { User } = require('../src/users/entities/user.entity');
const { Product } = require('../src/products/entities/product.entity');
const { Category } = require('../src/products/entities/category.entity');
const { Order, OrderItem } = require('../src/orders/entities');
const { Cart } = require('../src/carts/entities/cart.entity');
const { Address } = require('../src/addresses/entities/address.entity');

async function migrateDatabase() {
  console.log('🔄 开始数据库迁移...');
  
  const dataSource = new DataSource({
    ...config,
    entities: [User, Product, Category, Order, OrderItem, Cart, Address],
    synchronize: true, // 第一次创建表结构
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ 数据库连接成功');

    // 创建初始数据
    await createInitialData(dataSource);
    
    console.log('🎉 数据库迁移完成！');
  } catch (error) {
    console.error('❌ 数据库迁移失败:', error.message);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

async function createInitialData(dataSource) {
  console.log('🔄 创建初始数据...');

  const categoryRepository = dataSource.getRepository(Category);
  const productRepository = dataSource.getRepository(Product);
  const userRepository = dataSource.getRepository(User);

  // 创建默认分类
  const categories = await categoryRepository.save([
    { 
      name: '精选推荐', 
      description: '精选商品推荐', 
      sortOrder: 1,
      imageUrl: '/images/category1.jpg'
    },
    { 
      name: '人气热销', 
      description: '热销商品', 
      sortOrder: 2,
      imageUrl: '/images/category2.jpg'
    },
    { 
      name: '新品上市', 
      description: '最新上架商品', 
      sortOrder: 3,
      imageUrl: '/images/category3.jpg'
    },
    { 
      name: '特价优惠', 
      description: '特价优惠商品', 
      sortOrder: 4,
      imageUrl: '/images/category4.jpg'
    },
  ]);

  console.log(`✅ 创建了 ${categories.length} 个分类`);

  // 创建示例商品
  const products = await productRepository.save([
    {
      name: 'KitchenMate 智能电饭煲',
      description: '多功能智能电饭煲，支持预约烹饪',
      price: 299.9,
      originalPrice: 399.9,
      stock: 100,
      imageUrl: '/images/product1.jpg',
      imageUrls: ['/images/product1-1.jpg', '/images/product1-2.jpg'],
      category: categories[0],
      specifications: {
        brand: 'KitchenMate',
        capacity: '4L',
        power: '800W'
      }
    },
    {
      name: '不锈钢炒锅套装',
      description: '高品质不锈钢炒锅，导热均匀',
      price: 199.9,
      originalPrice: 269.9,
      stock: 50,
      imageUrl: '/images/product2.jpg',
      category: categories[1],
      specifications: {
        brand: 'CookMaster',
        material: '不锈钢',
        diameter: '32cm'
      }
    },
    {
      name: '厨房刀具套装',
      description: '专业厨房刀具套装，锋利耐用',
      price: 159.9,
      originalPrice: 219.9,
      stock: 80,
      imageUrl: '/images/product3.jpg',
      category: categories[2],
      specifications: {
        brand: 'SharpEdge',
        material: '高碳钢',
        pieces: '6件套'
      }
    },
  ]);

  console.log(`✅ 创建了 ${products.length} 个示例商品`);

  // 创建测试用户（密码加密）
  const hashedPassword = await bcrypt.hash('test123456', 12);
  const testUser = await userRepository.save({
    username: 'testuser',
    email: 'test@example.com',
    password: hashedPassword,
    phone: '13800138000',
    isActive: true,
    isVerified: true,
  });

  console.log('✅ 创建了测试用户');
  console.log('📧 测试账号: test@example.com');
  console.log('🔑 测试密码: test123456');
  
  return { categories, products, testUser };
}

// 如果是直接运行此脚本
if (require.main === module) {
  migrateDatabase();
}

module.exports = { migrateDatabase };