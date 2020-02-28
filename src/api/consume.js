import request from '@/utils/request.js';

//获取消费订单列表
export function getConsumptionRecords(data){
	return request({
<<<<<<< HEAD
		url:'https://tonglingok.com/canteen/api/v1/order/consumptionRecords',
=======
		url:'/api/v1/order/consumptionRecords',
>>>>>>> dev-http
		method:'get',
		params:data
	});
};

//获取消费订单详情
export function getConsumeDetail(data){
	return request({
<<<<<<< HEAD
		url:'https://tonglingok.com/canteen/api/v1/order/consumptionRecords/detail',
=======
		url:'/api/v1/order/consumptionRecords/detail',
>>>>>>> dev-http
		method:'get',
		params:data
	});
};