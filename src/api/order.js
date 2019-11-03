import request from '@/utils/request.js';

export function userOrderings(data){
	return request({
		url:'/v1/order/userOrderings',
		method:'get',
		params:data
	});
};

export function getOrderDetail(data){
	return request({
		url:'/v1/order/detail',
		method:'get',
		params:data
	});
};

export function cancelOrder(data){
	return request({
		url:'/v1/shop/order/cancel',
		method:'post',
		data
	});
};

export function deliveryCode(data){
	return request({
		url:'v1/shop/order/deliveryCode',
		method:'get',
		params:data
	});
};