import { wechatLogin as wechatLoginService, phoneLogin, passwordLogin, register, sendVerification, updateUserInfo } from '../../services/user';

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPhoneLogin: false,
    showPasswordLogin: false,
    showRegister: false,
    mobile: '',
    verificationCode: '',
    password: '',
    nickname: '',
    countdown: 0,
    timer: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  // 显示手机号登录视图
  showPhoneLoginView() {
    this.setData({
      showPhoneLogin: true,
      showPasswordLogin: false,
      showRegister: false,
      mobile: '',
      verificationCode: '',
      password: '',
      nickname: ''
    });
  },

  // 显示密码登录视图
  showPasswordLoginView() {
    this.setData({
      showPasswordLogin: true,
      showPhoneLogin: false,
      showRegister: false,
      mobile: '',
      verificationCode: '',
      password: '',
      nickname: ''
    });
  },

  // 显示注册视图
  showRegisterView() {
    this.setData({
      showRegister: true,
      showPhoneLogin: false,
      showPasswordLogin: false,
      mobile: '',
      verificationCode: '',
      password: '',
      nickname: ''
    });
  },

  // 显示登录选择视图
  showLoginView() {
    this.setData({
      showPhoneLogin: false,
      showPasswordLogin: false,
      showRegister: false,
      mobile: '',
      verificationCode: '',
      password: '',
      nickname: ''
    });
  },

  // 手机号输入事件
  onMobileInput(e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  // 验证码输入事件
  onVerificationCodeInput(e) {
    this.setData({
      verificationCode: e.detail.value
    });
  },

  // 密码输入事件
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 昵称输入事件
  onNicknameInput(e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  // 发送验证码
  sendVerificationCode() {
    const { mobile } = this.data;
    
    // 验证手机号格式
    if (!this.validateMobile(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    sendVerification(mobile).then((res) => {
      if (res.data && res.data.message) {
        wx.showToast({
          title: '验证码发送成功',
          icon: 'success'
        });

        // 开始倒计时
        this.startCountdown();
      } else {
        wx.showToast({
          title: '验证码发送失败',
          icon: 'none'
        });
      }
    }).catch((err) => {
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    });
  },

  // 开始倒计时
  startCountdown() {
    this.setData({
      countdown: 60
    });

    this.data.timer = setInterval(() => {
      if (this.data.countdown > 0) {
        this.setData({
          countdown: this.data.countdown - 1
        });
      } else {
        clearInterval(this.data.timer);
        this.setData({
          timer: null
        });
      }
    }, 1000);
  },

  // 验证手机号格式
  validateMobile(mobile) {
    const mobileRegex = /^1[3-9]\d{9}$/;
    return mobileRegex.test(mobile);
  },

  // 微信登录
  wechatLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          wechatLoginService(res.code).then((loginRes) => {
            if (loginRes.data && loginRes.data.token) {
              // 保存token到本地存储
              wx.setStorageSync('token', loginRes.data.token);
              
              // 保存用户信息
              app.globalData.userInfo = loginRes.data.user;
              
              wx.showToast({
                title: '登录成功',
                icon: 'success'
              });

              // 获取用户位置信息并更新
              this.getUserLocationAndSave();

              // 返回上一页或跳转到首页
              setTimeout(() => {
                const pages = getCurrentPages();
                if (pages.length > 1) {
                  wx.navigateBack();
                } else {
                  wx.redirectTo({
                    url: '/pages/home/home'
                  });
                }
              }, 1500);
            } else {
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              });
            }
          }).catch((err) => {
            wx.showToast({
              title: '网络请求失败',
              icon: 'none'
            });
          });
        } else {
          wx.showToast({
            title: '获取登录凭证失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '微信登录失败',
          icon: 'none'
        });
      }
    });
  },

  // 手机号登录
  phoneLogin() {
    const { mobile, verificationCode } = this.data;

    // 验证输入
    if (!this.validateMobile(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      wx.showToast({
        title: '请输入6位验证码',
        icon: 'none'
      });
      return;
    }

    phoneLogin(mobile, verificationCode).then((res) => {
      if (res.data && res.data.token) {
        // 保存token到本地存储
        wx.setStorageSync('token', res.data.token);
        
        // 保存用户信息
        app.globalData.userInfo = res.data.user;
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });

        // 获取用户位置信息并更新
        this.getUserLocationAndSave();

        // 返回上一页或跳转到首页
        setTimeout(() => {
          const pages = getCurrentPages();
          if (pages.length > 1) {
            wx.navigateBack();
          } else {
            wx.redirectTo({
              url: '/pages/home/home'
            });
          }
        }, 1500);
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    }).catch((err) => {
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    });
  },

  // 密码登录
  passwordLogin() {
    const { mobile, password } = this.data;

    // 验证输入
    if (!this.validateMobile(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    if (!password || password.length < 6) {
      wx.showToast({
        title: '密码至少6位',
        icon: 'none'
      });
      return;
    }

    passwordLogin(mobile, password).then((res) => {
      if (res.data && res.data.token) {
        // 保存token到本地存储
        wx.setStorageSync('token', res.data.token);
        
        // 保存用户信息
        app.globalData.userInfo = res.data.user;
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });

        // 获取用户位置信息并更新
        this.getUserLocationAndSave();

        // 返回上一页或跳转到首页
        setTimeout(() => {
          const pages = getCurrentPages();
          if (pages.length > 1) {
            wx.navigateBack();
          } else {
            wx.redirectTo({
              url: '/pages/home/home'
            });
          }
        }, 1500);
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    }).catch((err) => {
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    });
  },

  // 用户注册
  register() {
    const { mobile, password, nickname } = this.data;

    // 验证输入
    if (!this.validateMobile(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    if (!password || password.length < 6) {
      wx.showToast({
        title: '密码至少6位',
        icon: 'none'
      });
      return;
    }

    if (!nickname || nickname.trim().length === 0) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    register(mobile, password, nickname).then((res) => {
      if (res.data && res.data.token) {
        // 保存token到本地存储
        wx.setStorageSync('token', res.data.token);
        
        // 保存用户信息
        app.globalData.userInfo = res.data.user;
        
        wx.showToast({
          title: '注册成功',
          icon: 'success'
        });

        // 获取用户位置信息并更新
        this.getUserLocationAndSave();

        // 返回上一页或跳转到首页
        setTimeout(() => {
          const pages = getCurrentPages();
          if (pages.length > 1) {
            wx.navigateBack();
          } else {
            wx.redirectTo({
              url: '/pages/home/home'
            });
          }
        }, 1500);
      } else {
        wx.showToast({
          title: '注册失败',
          icon: 'none'
        });
      }
    }).catch((err) => {
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    });
  },

  // 获取用户位置信息并保存到服务器
  getUserLocationAndSave() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res;
        
        console.log('获取位置成功:', latitude, longitude);
        
        // 更新用户位置信息到服务器
        updateUserInfo({
          latitude: latitude,
          longitude: longitude
        }).then((updateRes) => {
          console.log('位置信息更新成功:', updateRes);
        }).catch((err) => {
          console.error('位置信息更新失败:', err);
        });
      },
      fail: (err) => {
        console.log('获取位置失败:', err);
        // 如果用户拒绝位置授权，也可以继续，只是没有位置信息
      }
    });
  }
});