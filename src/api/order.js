import request from '@/utils/request.js';

export function userOrderings(data){
	return request({
		url:'https://tonglingok.com/canteen/api/v1/order/userOrderings',
		method:'get',
		params:data
	});
};
//获取订单详情
export function getOrderDetail(data){
	return request({
		url:'https://tonglingok.com/canteen/api/v1/order/detail',
		method:'get',
		params:data
	});
};
//取消订单
export function cancelOrder(data){
	return request({
		url:'https://tonglingok.com/canteen/api/v1/shop/order/cancel',
		method:'post',
		data
	});
};
//获取提货码
export function deliveryCode(data){
	return request({
		url:'https://tonglingok.com/canteen/api/v1/shop/order/deliveryCode',
		method:'get',
		params:data
	});
};
//取消订单
export function cancelSelfOrder(data){
	return request({
		url:'https://tonglingok.com/canteen/api/v1/order/cancel',
		method:'post',
		data
	});
};