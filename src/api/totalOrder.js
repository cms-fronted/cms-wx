import request from '@/utils/request.js';

//获取餐次订餐信息
export function getOrdersInfo(data){
	return request({
		url:'http://canteen.tonglingok.com/api/v1/order/managerOrders',
		method:'get',
		params:data
	});
};

/* 点击订餐数量获取菜品统计 */
export function managerDinnerStatistic(data){
	return request({
		url:'http://canteen.tonglingok.com/api/v1/order/managerDinnerStatistic',
		method:'get',
		params:data
	});
};

//点击订餐数量获取订餐人员统计
export function usersStatistic(data){
	return request({
		url:'http://canteen.tonglingok.com/api/v1/order/usersStatistic',
		method:'get',
		params:data
	});
};

//订餐未就餐一件扣费
export function charging(data){
	return request({
		url:'http://canteen.tonglingok.com/api/v1/order/handelOrderedNoMeal',
		method:'post',
		data
	});
};