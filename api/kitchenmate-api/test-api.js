const axios = require('axios');

// 测试API端点
async function testAPI() {
  const BASE_URL = 'http://localhost:3000';
  
  console.log('开始测试API端点...');
  
  try {
    // 测试获取用户信息端点（需要认证，预期返回401）
    try {
      const userInfoRes = await axios.get(`${BASE_URL}/auth/user-info`);
      console.log('用户信息端点测试失败 - 应该需要认证');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✓ 用户信息端点（需要认证）: 正常 - 返回401未授权');
      } else {
        console.log('✗ 用户信息端点测试失败:', error.message);
      }
    }
    
    // 测试发送验证码端点（测试错误输入）
    try {
      const verificationRes = await axios.post(`${BASE_URL}/auth/send-verification`, {
        mobile: 'invalid-mobile'
      });
      console.log('✗ 发送验证码端点测试失败 - 应该验证手机号格式');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✓ 发送验证码端点: 正常 - 返回400验证失败');
      } else {
        console.log('✗ 发送验证码端点测试失败:', error.message);
      }
    }
    
    // 测试微信登录端点（测试错误输入）
    try {
      const wechatLoginRes = await axios.post(`${BASE_URL}/auth/wechat-login`, {
        code: ''
      });
      console.log('✗ 微信登录端点测试失败 - 应该验证输入');
    } catch (error) {
      if (error.response) {
        console.log('✓ 微信登录端点: 正常 - 返回验证错误');
      } else {
        console.log('✗ 微信登录端点测试失败:', error.message);
      }
    }
    
    // 测试手机号登录端点（测试错误输入）
    try {
      const phoneLoginRes = await axios.post(`${BASE_URL}/auth/phone-login`, {
        mobile: '12345678901',
        verificationCode: '123456'
      });
      console.log('✗ 手机号登录端点测试失败 - 应该验证验证码');
    } catch (error) {
      if (error.response) {
        console.log('✓ 手机号登录端点: 正常 - 返回验证错误');
      } else {
        console.log('✗ 手机号登录端点测试失败:', error.message);
      }
    }
    
    console.log('API端点测试完成！');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
  }
}

testAPI();