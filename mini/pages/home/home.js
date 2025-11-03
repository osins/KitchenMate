import { fetchHome } from '../../services/home/home';
import { fetchGoodsList } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    imgSrcs: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: { type: 'dots' },
    swiperImageProps: { mode: 'scaleToFill' },
  },

  goodListPagination: {
    index: 0,
    num: 20,
  },

  privateData: {
    tabIndex: 0,
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });
    fetchHome().then(({ swiper, tabList, featuredProducts }) => {
      // 处理轮播图数据格式
      const imgSrcs = swiper.map(item => item.img || item);
      
      this.setData({
        tabList,
        imgSrcs,
        pageLoading: false,
      });
      
      // 如果有推荐商品数据，直接显示
      if (featuredProducts && featuredProducts.length > 0) {
        this.setData({
          goodsList: this.transformProductData(featuredProducts),
          goodsListLoadStatus: 0,
        });
      } else {
        this.loadGoodsList(true);
      }
    }).catch(error => {
      console.error('加载首页数据失败:', error);
      this.setData({
        pageLoading: false,
        goodsListLoadStatus: 3, // 显示错误状态
      });
    });
  },

  /**
   * 转换商品数据格式为前端所需格式
   */
  transformProductData(products) {
    return products.map(product => ({
      spuId: product.id || product.spuId,
      thumb: product.imageUrl || product.thumb,
      title: product.name || product.title,
      price: product.price,
      originPrice: product.originalPrice || product.originPrice,
      tags: product.category ? [product.category.name] : product.tags || ['推荐'],
      stock: product.stock || 0,
      sales: product.sales || 0,
    }));
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail;
    this.loadGoodsList(true);
  },

  onReTry() {
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({ goodsListLoadStatus: 1 });

    const pageSize = this.goodListPagination.num;
    let pageIndex = this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1;
    if (fresh) {
      pageIndex = 1;
    }

    try {
      const nextList = await fetchGoodsList(pageIndex, pageSize);
      this.setData({
        goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
        goodsListLoadStatus: 0,
      });

      this.goodListPagination.index = pageIndex;
      this.goodListPagination.num = pageSize;
    } catch (err) {
      console.error('加载商品列表失败:', err);
      
      // 如果后端API失败，尝试使用mock数据作为降级方案
      try {
        const { config } = require('../../config/index');
        if (!config.useMock) {
          // 临时切换到mock模式
          config.useMock = true;
          const nextList = await fetchGoodsList(pageIndex, pageSize);
          config.useMock = false; // 恢复原始配置
          
          this.setData({
            goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
            goodsListLoadStatus: 0,
          });
          
          this.goodListPagination.index = pageIndex;
          this.goodListPagination.num = pageSize;
          
          // 显示降级提示
          wx.showToast({
            title: '使用模拟数据',
            icon: 'none',
            duration: 2000,
          });
        } else {
          this.setData({ goodsListLoadStatus: 3 });
        }
      } catch (mockErr) {
        this.setData({ goodsListLoadStatus: 3 });
      }
    }
  },

  goodListClickHandle(e) {
    const { index } = e.detail;
    const { spuId } = this.data.goodsList[index];
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },

  goodListAddCartHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加入购物车',
    });
  },

  navToSearchPage() {
    wx.navigateTo({ url: '/pages/goods/search/index' });
  },

  navToActivityDetail({ detail }) {
    const { index: promotionID = 0 } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion/promotion-detail/index?promotion_id=${promotionID}`,
    });
  },
});
