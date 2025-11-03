import { request } from './request';

/**
 * 从后端API获取首页数据
 */
export function fetchHomeFromAPI() {
  return request('/home');
}

/**
 * 获取轮播图数据
 */
export function fetchBanners() {
  return request('/banners');
}

/**
 * 获取分类列表
 */
export function fetchCategories() {
  return request('/categories');
}

/**
 * 获取推荐商品
 */
export function fetchFeaturedProducts() {
  return request('/products/featured');
}