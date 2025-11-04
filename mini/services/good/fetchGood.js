import { config } from '../../config/index';

/** 获取商品列表 */
function mockFetchGood(ID = 0) {
  const { delay } = require('../_utils/delay');
  const { genGood } = require('../../model/good');
  return delay().then(() => genGood(ID));
}

/** 获取商品 */
export function fetchGood(ID = 0) {
  console.log('开始加载商品', ID, 'use mock', config.useMock)

  if (config.useMock) {
    return mockFetchGood(ID);
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${getApp().globalData.baseUrl}/good/${ID}`,
      method: 'GET',
      success: ({data: body, statusCode}) => {
        console.log('获取商品成功', body.data)

        if (statusCode === 200 && body.code == 200) {
          resolve(body.data);
        } else {
          console.error('获取商品失败:', body.message);
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
