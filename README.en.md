# KitchenMate

<div align="center">

[![](https://img.shields.io/github/stars/osins/KitchenMate?style=for-the-badge&logo=github&color=green&label=Stars)](https://github.com/osins/KitchenMate) 
[![](https://img.shields.io/github/forks/osins/KitchenMate?style=for-the-badge&logo=github&color=yellow&label=Forks)](https://github.com/osins/KitchenMate) 
[![](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/osins/KitchenMate/blob/main/LICENSE)
[![](https://img.shields.io/badge/Language-TypeScript-informational?style=for-the-badge&logo=typescript&logoColor=white&color=3178C6)](https://github.com/osins/KitchenMate)

</div>

**KitchenMate** is a full-stack e-commerce solution with both backend API service and WeChat Mini Program frontend. The backend is built with NestJS + TypeORM + MySQL, and the frontend is developed using the TDesign WeChat Mini Program component library, providing complete e-commerce functionality.

## 🌟 Features

### 🎯 API Service (NestJS)
- **User Authentication**: JWT authentication, supports registration, login, and permission validation
- **Product Management**: Product CRUD operations, category management
- **Order System**: Complete order lifecycle management
- **Shopping Cart**: User shopping cart functionality
- **Address Management**: User address CRUD operations
- **High Performance**: Uses Fastify as HTTP server for excellent performance
- **Security**: Helmet security middleware, CORS configuration, request rate limiting
- **Database**: TypeORM support with MySQL data storage
- **API Documentation**: Automated API documentation with Swagger

### 📱 Mini Program Frontend (TDesign)
- **Complete E-commerce**: Includes home page, product categories, shopping cart, personal center, etc.
- **Shopping Flow**: Complete flow from product browsing to checkout and payment
- **Order Management**: Order list, order details, after-sales service
- **Address Management**: Delivery address management
- **Coupon System**: Coupon list, promotional goods, detail pages
- **Component Library**: Based on TDesign WeChat Mini Program component library
- **User Experience**: Optimized interaction experience and page loading speed

## 📁 Project Structure

```
KitchenMate/
├── api/                    # 🚀 Backend API Service (NestJS)
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management module
│   │   ├── products/      # Product management module
│   │   ├── orders/        # Order management module
│   │   ├── carts/         # Cart module
│   │   ├── addresses/     # Address management module
│   │   ├── database/      # Database configuration
│   │   └── health/        # Health check module
│   ├── package.json
│   └── ...
├── mini/                   # 📱 WeChat Mini Program Frontend
│   ├── pages/             # Page modules
│   │   ├── home/          # Home page
│   │   ├── category/      # Product category
│   │   ├── cart/          # Shopping cart
│   │   ├── usercenter/    # Personal center
│   │   ├── goods/         # Product related pages
│   │   ├── order/         # Order related pages
│   │   ├── coupon/        # Coupon related pages
│   │   └── promotion/     # Promotion pages
│   ├── components/        # Component library
│   ├── services/          # API services
│   ├── model/             # Data models
│   ├── utils/             # Utility functions
│   └── ...
├── doc/                    # 📚 Project documentation
└── test/                   # 🧪 Test files
```

## 🛠 Tech Stack

### Backend (api/)
- **Framework**: [NestJS](https://nestjs.com/) - Modern Node.js framework
- **HTTP Server**: [Fastify](https://www.fastify.io/) - High-performance framework
- **Database**: [MySQL](https://www.mysql.com/) - Relational database
- **ORM**: [TypeORM](https://typeorm.io/) - Object Relational Mapping
- **Authentication**: [JWT](https://jwt.io/) - JSON Web Token
- **Security**: [Helmet](https://helmetjs.github.io/) - Security middleware
- **API Documentation**: [Swagger](https://swagger.io/) - API documentation generator

### Frontend (mini/)
- **Framework**: WeChat Mini Program native framework
- **Component Library**: [TDesign](https://tdesign.tencent.com/miniprogram) - Enterprise-level design system
- **State Management**: Mini Program native data binding
- **Build Tool**: Mini Program development tools

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MySQL >= 8.0
- WeChat Developer Tools

### Starting the Backend Service

1. **Clone the project**
```bash
git clone https://github.com/osins/KitchenMate.git
cd KitchenMate
```

2. **Start the backend service**
```bash
cd api
npm install
# Configure environment variables (.env)
cp .env.example .env
# Start development server
npm run start:dev
```

3. **API service will run on**: http://localhost:7001

### Starting the Mini Program Frontend

1. **Install dependencies**
```bash
cd mini
npm install
```

2. **Build npm**
```bash
# Execute build npm operation in WeChat Developer Tools
```

3. **Open with WeChat Developer Tools** the `mini` directory

## 📋 API Endpoints

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile (requires authentication)

### User Endpoints
- `GET /api/v1/users` - Get user list
- `GET /api/v1/users/:id` - Get user information
- `PUT /api/v1/users/:id` - Update user information

### Product Endpoints
- `GET /api/v1/products` - Get product list
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product (requires admin privileges)
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Order Endpoints
- `GET /api/v1/orders` - Get order list
- `GET /api/v1/orders/:id` - Get order details
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/:id` - Update order

### Cart Endpoints
- `GET /api/v1/carts` - Get cart
- `POST /api/v1/carts` - Add item to cart
- `PUT /api/v1/carts/:id` - Update cart item
- `DELETE /api/v1/carts/:id` - Remove item from cart

### Address Endpoints
- `GET /api/v1/addresses` - Get address list
- `GET /api/v1/addresses/:id` - Get address details
- `POST /api/v1/addresses` - Create address
- `PUT /api/v1/addresses/:id` - Update address
- `DELETE /api/v1/addresses/:id` - Delete address

## 🧪 Testing

### Backend Tests
```bash
# Run unit tests
npm run test

# Run coverage tests
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t kitchenmate-api .

# Run container
docker run -p 7001:7001 kitchenmate-api
```

### Cloud Function Deployment (Alibaba Cloud)
The project is configured to run on Alibaba Cloud Function Compute. Please refer to project documentation for specific deployment instructions.

## 🤝 Contributing

Feel free to submit Issues and Pull Requests to help improve the project!

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [TDesign](https://github.com/Tencent/tdesign-miniprogram) - Enterprise-level design system for Mini Programs
- [NestJS](https://nestjs.com/) - Modern, elegant Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript
- [Fastify](https://www.fastify.io/) - Fast and low overhead Node.js web framework
- [WeChat Mini Program](https://developers.weixin.qq.com/miniprogram/dev/framework/) - Mini Program development framework

---

<div align="center">

**⭐ If this project is helpful to you, please give it a Star!**

</div>