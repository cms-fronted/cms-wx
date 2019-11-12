import request from '@/utils/request.js';

//获取消费订单列表
export function getConsumptionRecords(data){
	return request({
		url:'/v1/order/consumptionRecords',
		method:'get',
		params:data
	});
};

//获取消费订单详情
export function getConsumeDetail(data){
	return request({
		url:'/v1/order/consumptionRecords/detail',
		method:'get',
		params:data
	});
};