import { config, cdnBase } from '../../config/index';

/** 从后端API获取首页数据 */
function apiFetchHome() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}/products/featured`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          // 转换后端API数据结构为前端所需格式
          const apiData = res.data.data;
          
          // 构建轮播图数据（可以从后端获取或使用默认数据）
          const swiper = apiData.map(product => ({
            img: product.imageUrl || `${cdnBase}/activity/banner.png`,
            title: product.name,
          }));
          
          // 构建分类标签
          const tabList = [
            { text: '精选推荐', key: 0 },
            { text: '人气热销', key: 1 },
            { text: '新品上市', key: 2 },
            { text: '特价优惠', key: 3 },
          ];
          
          resolve({
            swiper: swiper.length > 0 ? swiper : [{ img: `${cdnBase}/activity/banner.png`, title: '默认轮播图' }],
            tabList,
            activityImg: `${cdnBase}/activity/banner.png`,
            featuredProducts: apiData, // 传递推荐商品数据
          });
        } else {
          reject(new Error('获取首页数据失败'));
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}

/** 获取首页数据 */
export function fetchHome() {
  if (config.useMock) {
    // 保留原有的mock数据作为备用
    const { delay } = require('../_utils/delay');
    const { genSwiperImageList } = require('../../model/swiper');
    return delay().then(() => {
      return {
        swiper: genSwiperImageList(),
        tabList: [
          { text: '精选推荐', key: 0 },
          { text: '夏日防晒', key: 1 },
          { text: '二胎大作战', key: 2 },
          { text: '人气榜', key: 3 },
          { text: '好评榜', key: 4 },
          { text: 'RTX 30', key: 5 },
          { text: '手机也疯狂', key: 6 },
        ],
        activityImg: `${cdnBase}/activity/banner.png`,
      };
    });
  }
  
  return apiFetchHome();
}
