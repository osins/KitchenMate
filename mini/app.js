import updateManager from './common/updateManager';

App({
  globalData: {
    userInfo: null,
    baseUrl: 'http://localhost:7001' // 后端API地址，开发环境使用localhost，生产环境使用实际域名
  },
  onLaunch: function () {},
  onShow: function () {
    updateManager();
  },
});
