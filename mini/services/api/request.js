const API_BASE_URL = 'http://localhost:7001/api/v1'; // 替换为实际后端API地址

/**
 * 网络请求工具
 */
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.success) {
            resolve(res.data.data);
          } else {
            reject(new Error(res.data.message || '请求失败'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * 带认证的请求
 */
function authRequest(url, options = {}) {
  const token = wx.getStorageSync('token');
  
  return request(url, {
    ...options,
    header: {
      'Authorization': `Bearer ${token}`,
      ...options.header,
    },
  });
}

export { request, authRequest };