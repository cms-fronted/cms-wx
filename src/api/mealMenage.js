import request from '@/utils/request.js';

//获取商品列表
export function getFoodList(data) {
	return request({
		url:'/api/v1/foods/officialManager',
		method:'get',
		params:data
	});
};

//获取所选餐次可选菜类型
export function getMenuId(data){
	return request({
		url:'/api/v1/menus/dinner',
		metho:'get',
		params:data
	});
};

//菜品状态操作
export function changeType(data){
	return request({
		url:'/api/v1/food/day/handel',
		method:'post',
		data
	});
};