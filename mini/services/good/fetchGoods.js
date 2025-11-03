import { config } from '../../config/index';

/** 从后端API获取商品列表 */
function apiFetchGoodsList(pageIndex = 1, pageSize = 20) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}/products`,
      method: 'GET',
      data: {
        page: pageIndex,
        limit: pageSize,
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          const apiData = res.data.data.products || [];
          
          // 转换后端数据结构为前端所需格式
          const goodsList = apiData.map((product) => ({
            spuId: product.id,
            thumb: product.imageUrl || '/images/default-product.png',
            title: product.name,
            price: product.price,
            originPrice: product.originalPrice || product.price * 1.2, // 如果没有原价，设置一个默认值
            tags: product.category ? [product.category.name] : ['推荐'],
            stock: product.stock,
            sales: product.sales || 0,
          }));
          
          resolve(goodsList);
        } else {
          reject(new Error('获取商品列表失败'));
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}

/** mock数据获取商品列表 */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getGoodsList } = require('../../model/goods');
  return delay().then(() =>
    getGoodsList(pageIndex, pageSize).map((item) => {
      return {
        spuId: item.spuId,
        thumb: item.primaryImage,
        title: item.title,
        price: item.minSalePrice,
        originPrice: item.maxLinePrice,
        tags: item.spuTagList.map((tag) => tag.title),
      };
    }),
  );
}

/** 获取商品列表 */
export function fetchGoodsList(pageIndex = 1, pageSize = 20) {
  if (config.useMock) {
    return mockFetchGoodsList(pageIndex, pageSize);
  }
  
  return apiFetchGoodsList(pageIndex, pageSize);
}
