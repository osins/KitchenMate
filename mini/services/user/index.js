import { request } from '../_utils/request';

// 微信登录
export function wechatLogin(code) {
  return request({
    url: '/auth/wechat-login',
    method: 'POST',
    data: {
      code
    }
  });
}

// 手机号登录
export function phoneLogin(mobile, verificationCode) {
  return request({
    url: '/auth/phone-login',
    method: 'POST',
    data: {
      mobile,
      verificationCode
    }
  });
}

// 密码登录
export function passwordLogin(mobile, password) {
  return request({
    url: '/auth/password-login',
    method: 'POST',
    data: {
      mobile,
      password
    }
  });
}

// 用户注册
export function register(mobile, password, nickname) {
  return request({
    url: '/auth/register',
    method: 'POST',
    data: {
      mobile,
      password,
      nickname
    }
  });
}

// 发送验证码
export function sendVerification(mobile) {
  return request({
    url: '/auth/send-verification',
    method: 'POST',
    data: {
      mobile
    }
  });
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/auth/user-info',
    method: 'GET'
  });
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/auth/user-info',
    method: 'PUT',
    data
  });
}

// 绑定手机号
export function bindPhone(mobile, verificationCode) {
  return request({
    url: '/auth/bind-phone',
    method: 'POST',
    data: {
      mobile,
      verificationCode
    }
  });
}