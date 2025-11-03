import { request } from './request';

/**
 * 获取商品列表
 */
export function fetchProductsList(pageIndex = 1, pageSize = 20, params = {}) {
  const queryParams = new URLSearchParams({
    page: pageIndex,
    limit: pageSize,
    ...params,
  }).toString();
  
  return request(`/products?${queryParams}`);
}

/**
 * 获取商品详情
 */
export function fetchProductDetail(productId) {
  return request(`/products/${productId}`);
}

/**
 * 获取商品分类
 */
export function fetchProductCategories() {
  return request('/products/categories');
}

/**
 * 搜索商品
 */
export function searchProducts(keyword, pageIndex = 1, pageSize = 20) {
  const queryParams = new URLSearchParams({
    page: pageIndex,
    limit: pageSize,
    search: keyword,
  }).toString();
  
  return request(`/products?${queryParams}`);
}