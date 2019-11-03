import request from '@/utils/request.js';

export function getFoodList(data){
	return request({
		url:'/v1/foods/personChoice',
		method:'get',
		params:data
	});
};

//获取当前饭堂就餐类型
export function getDiningType(){
	return request({
		url:'/v1/canteen/diningMode',
		method:'get'
	});
};

//菜谱查询
export function getMenuQuery(data){
	return request({
		url:'/v1/foods/menu',
		method:'get',
		params:data
	});
};

//获取菜品评论信息
export function getComments(data){
	return request({
		url:'/api/v1/food/info/comment',
		method:'get',
		params:data
	});
};