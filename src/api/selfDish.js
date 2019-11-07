import request from '@/utils/request.js';
import QS from "qs";

//获取商品列表
export function getFoodList(data) {
	return request({
		url: '/v1/foods/personChoice',
		method: 'get',
		params: data
	});
};

//获取当前饭堂就餐类型
export function getDiningType() {
	return request({
		url: '/v1/canteen/diningMode',
		method: 'get'
	});
};

//菜谱查询
export function getMenuQuery(data) {
	return request({
		url: '/v1/foods/menu',
		method: 'get',
		params: data
	});
};

//获取菜品评论信息
export function getComments(data) {
	return request({
		url: '/api/v1/food/info/comment',
		method: 'get',
		params: data
	});
};

//提交订单 http://canteen.tonglingok.com/api/v1/order/personChoice/save
export function saveOrder(data) {
	return request({
		url: '/v1/order/personChoice/save',
		method: 'post',
		data: QS.stringify(data)
	});
};

//获取饭堂餐次配置信息
export function getDinnerInfo(data){
	return request({
		url:'/v1/order/personChoice/info',
		mathod:'get',
		params:data
	})
}