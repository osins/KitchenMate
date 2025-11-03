/**
 * 后端API配置
 * 根据环境自动切换API地址
 */

// 根据小程序环境判断API地址
const getApiBaseUrl = () => {
  // 开发环境
  if (__wxConfig.envVersion === 'develop') {
    return 'http://localhost:7001/api/v1';
  }
  
  // 体验版
  if (__wxConfig.envVersion === 'trial') {
    return 'https://your-test-api.example.com/api/v1';
  }
  
  // 正式版
  if (__wxConfig.envVersion === 'release') {
    return 'https://your-production-api.example.com/api/v1';
  }
  
  // 默认开发环境
  return 'http://localhost:7001/api/v1';
};

const apiConfig = {
  // 基础API地址
  baseUrl: getApiBaseUrl(),
  
  // 接口超时时间（毫秒）
  timeout: 15000,
  
  // 重试次数
  retryCount: 3,
  
  // 重试间隔（毫秒）
  retryDelay: 1000,
  
  // 接口路径配置
  endpoints: {
    // 首页相关
    home: '/home',
    banners: '/banners',
    categories: '/categories',
    featuredProducts: '/products/featured',
    
    // 商品相关
    products: '/products',
    productDetail: '/products/:id',
    productCategories: '/products/categories',
    
    // 用户相关
    login: '/auth/login',
    register: '/auth/register',
    userProfile: '/users/profile',
    
    // 购物车相关
    cart: '/carts',
    cartItem: '/carts/:id',
    
    // 订单相关
    orders: '/orders',
    orderDetail: '/orders/:id',
    
    // 地址相关
    addresses: '/addresses',
    addressDetail: '/addresses/:id',
    
    // 系统相关
    health: '/health',
  },
  
  // 获取完整的API URL
  getUrl(endpointKey, params = {}) {
    let url = this.endpoints[endpointKey];
    if (!url) {
      throw new Error(`API endpoint ${endpointKey} not found`);
    }
    
    // 替换URL参数
    url = url.replace(/:([^/]+)/g, (match, key) => {
      if (params[key] === undefined) {
        throw new Error(`Missing parameter: ${key}`);
      }
      return params[key];
    });
    
    return `${this.baseUrl}${url}`;
  },
};

export default apiConfig;