import request from '@/utils/request.js';

//获取小卖部商品列表
export function getShopList() {
	return request({
		url: '/v1/shop/official/products',
		method: 'get',
	});
};

//获取小卖部获取提货方式
export function getTakingMode() {
	return request({
		url: '/v1/shop/takingMode',
		method: 'get'
	});
};

//小卖部新增订单
export function addShopOrder(data) {
	return request({
		url: '/v1/shop/order/save',
		method: 'post',
		data
	});
};

//获取评论
export function getComments(data) {
	return request({
		url: '/v1/shop/product/comments',
		method: 'get',
		params: data
	});
};

//提交评论
export function saveComment(data) {
	return request({
		url: '/v1/shop/product/saveComment',
		method: 'post',
		data
	});
};
