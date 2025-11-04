import { config } from '../../config/index';

/** 获取商品列表 */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getGoodsList } = require('../../model/goods');
  return delay().then(() =>
    getGoodsList(pageIndex, pageSize).map((item) => {
      return {
        id: item.id,
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
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${getApp().globalData.baseUrl}/good/list`,
      method: 'GET',
      data: {
        pageIndex: Math.max(Math.abs(pageIndex), 0),  // 将home页面使用的1基索引转换为后端API需要的0基索引
        pageSize
      },
      success: (res) => {
        if (res.data.code === 200) {
          // 将API返回的数据转换为前端需要的格式
          const goodsList = (res.data.data.goodsList || []).map(item => {
            return {
              id: item.id,
              spuId: item.spuId,
              thumb: item.primaryImage,
              title: item.title,
              price: item.minSalePrice,
              originPrice: item.maxLinePrice,
              tags: (item.spuTagList || []).map(tag => tag.title),
            };
          });
          resolve(goodsList);
        } else {
          console.error('获取商品列表失败:', res.data.message);
          reject(new Error(res.data.message || '获取商品列表失败'));
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        reject(err);
      }
    });
  });
}
