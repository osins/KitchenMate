# KitchenMate

<div align="center">

[![](https://img.shields.io/github/stars/osins/KitchenMate?style=for-the-badge&logo=github&color=green&label=Stars)](https://github.com/osins/KitchenMate) 
[![](https://img.shields.io/github/forks/osins/KitchenMate?style=for-the-badge&logo=github&color=yellow&label=Forks)](https://github.com/osins/KitchenMate) 
[![](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/osins/KitchenMate/blob/main/LICENSE)
[![](https://img.shields.io/badge/Language-TypeScript-informational?style=for-the-badge&logo=typescript&logoColor=white&color=3178C6)](https://github.com/osins/KitchenMate)

</div>

**KitchenMate** 是一个全栈电商解决方案，包含后端 API 服务和微信小程序前端。后端使用 NestJS + TypeORM + MySQL 构建，前端采用 TDesign 微信小程序组件库开发，提供了完整的电商功能。

## 🌟 功能特性

### 🎯 API 服务 (NestJS)
- **用户认证**: JWT 认证，支持注册、登录、权限验证
- **商品管理**: 商品的增删改查、分类管理
- **订单系统**: 完整的订单生命周期管理
- **购物车**: 用户购物车功能
- **地址管理**: 用户地址的增删改查
- **高性能**: 使用 Fastify 作为 HTTP 服务器，性能卓越
- **安全防护**: Helmet 安全中间件，CORS 配置，请求限流
- **数据库**: TypeORM 支持，MySQL 数据存储
- **API 文档**: Swagger 自动化 API 文档

### 📱 小程序前端 (TDesign)
- **完整电商**: 包含首页、商品分类、购物车、个人中心等页面
- **购物流程**: 从商品浏览到下单支付的完整流程
- **订单管理**: 订单列表、订单详情、售后服务
- **地址管理**: 收货地址管理
- **优惠券系统**: 优惠券列表、活动商品、详情页
- **组件库**: 基于 TDesign 微信小程序组件库
- **用户体验**: 优化的交互体验和页面加载速度

## 📁 项目结构

```
KitchenMate/
├── api/                    # 🚀 后端 API 服务 (NestJS)
│   ├── src/
│   │   ├── auth/          # 用户认证模块
│   │   ├── users/         # 用户管理模块
│   │   ├── products/      # 商品管理模块
│   │   ├── orders/        # 订单管理模块
│   │   ├── carts/         # 购物车模块
│   │   ├── addresses/     # 地址管理模块
│   │   ├── database/      # 数据库配置
│   │   └── health/        # 健康检查模块
│   ├── package.json
│   └── ...
├── mini/                   # 📱 微信小程序前端
│   ├── pages/             # 页面模块
│   │   ├── home/          # 首页
│   │   ├── category/      # 商品分类
│   │   ├── cart/          # 购物车
│   │   ├── usercenter/    # 个人中心
│   │   ├── goods/         # 商品相关页面
│   │   ├── order/         # 订单相关页面
│   │   ├── coupon/        # 优惠券相关页面
│   │   └── promotion/     # 促销活动页面
│   ├── components/        # 组件库
│   ├── services/          # 接口服务
│   ├── model/             # 数据模型
│   ├── utils/             # 工具函数
│   └── ...
├── doc/                    # 📚 项目文档
└── test/                   # 🧪 测试文件
```

## 🛠 技术栈

### 后端 (api/)
- **框架**: [NestJS](https://nestjs.com/) - 现代 Node.js 框架
- **HTTP 服务器**: [Fastify](https://www.fastify.io/) - 高性能框架
- **数据库**: [MySQL](https://www.mysql.com/) - 关系型数据库
- **ORM**: [TypeORM](https://typeorm.io/) - 对象关系映射
- **认证**: [JWT](https://jwt.io/) - JSON Web Token
- **安全**: [Helmet](https://helmetjs.github.io/) - 安全中间件
- **API 文档**: [Swagger](https://swagger.io/) - API 文档生成

### 前端 (mini/)
- **框架**: 微信小程序原生框架
- **组件库**: [TDesign](https://tdesign.tencent.com/miniprogram) - 企业级设计体系
- **状态管理**: 小程序原生数据绑定
- **构建工具**: 小程序开发工具

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- MySQL >= 8.0
- 微信开发者工具

### 后端服务启动

1. **克隆项目**
```bash
git clone https://github.com/osins/KitchenMate.git
cd KitchenMate
```

2. **启动后端服务**
```bash
cd api
npm install
# 配置环境变量 (.env)
cp .env.example .env
# 启动开发服务器
npm run start:dev
```

3. **API 服务将运行在**: http://localhost:7001

### 前端小程序启动

1. **安装依赖**
```bash
cd mini
npm install
```

2. **构建 npm**
```bash
# 在微信开发者工具中执行构建 npm 操作
```

3. **使用微信开发者工具打开** `mini` 目录

## 📋 API 接口

### 认证接口
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/profile` - 获取用户信息 (需认证)

### 用户接口
- `GET /api/v1/users` - 获取用户列表
- `GET /api/v1/users/:id` - 获取用户信息
- `PUT /api/v1/users/:id` - 更新用户信息

### 商品接口
- `GET /api/v1/products` - 获取商品列表
- `GET /api/v1/products/:id` - 获取商品详情
- `POST /api/v1/products` - 创建商品 (需管理员权限)
- `PUT /api/v1/products/:id` - 更新商品
- `DELETE /api/v1/products/:id` - 删除商品

### 订单接口
- `GET /api/v1/orders` - 获取订单列表
- `GET /api/v1/orders/:id` - 获取订单详情
- `POST /api/v1/orders` - 创建订单
- `PUT /api/v1/orders/:id` - 更新订单

### 购物车接口
- `GET /api/v1/carts` - 获取购物车
- `POST /api/v1/carts` - 添加商品到购物车
- `PUT /api/v1/carts/:id` - 更新购物车商品
- `DELETE /api/v1/carts/:id` - 删除购物车商品

### 地址接口
- `GET /api/v1/addresses` - 获取地址列表
- `GET /api/v1/addresses/:id` - 获取地址详情
- `POST /api/v1/addresses` - 创建地址
- `PUT /api/v1/addresses/:id` - 更新地址
- `DELETE /api/v1/addresses/:id` - 删除地址

## 🧪 测试

### 后端测试
```bash
# 运行单元测试
npm run test

# 运行覆盖率测试
npm run test:cov

# 运行 e2e 测试
npm run test:e2e
```

## 🚀 部署

### Docker 部署
```bash
# 构建镜像
docker build -t kitchenmate-api .

# 运行容器
docker run -p 7001:7001 kitchenmate-api
```

### 云函数部署 (阿里云)
项目已配置为在阿里云函数计算上运行，具体部署请参考项目文档。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 鸣谢

- [TDesign](https://github.com/Tencent/tdesign-miniprogram) - 企业级设计体系小程序解决方案
- [NestJS](https://nestjs.com/) - 现代优雅的 Node.js 框架
- [TypeORM](https://typeorm.io/) - TypeScript 和 JavaScript 的 ORM
- [Fastify](https://www.fastify.io/) - 高性能 Node.js web 框架
- [微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/) - 小程序开发框架

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star！**

</div>