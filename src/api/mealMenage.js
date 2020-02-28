import request from '@/utils/request.js';

//获取商品列表
export function getFoodList(data) {
	return request({
<<<<<<< HEAD
		url:'https://tonglingok.com/canteen/api/v1/foods/officialManager',
=======
		url:'/api/v1/foods/officialManager',
>>>>>>> dev-http
		method:'get',
		params:data
	});
};

//获取所选餐次可选菜类型
export function getMenuId(data){
	return request({
<<<<<<< HEAD
		url:'https://tonglingok.com/canteen/api/v1/menus/dinner',
=======
		url:'/api/v1/menus/dinner',
>>>>>>> dev-http
		metho:'get',
		params:data
	});
};

//菜品状态操作
export function changeType(data){
	return request({
<<<<<<< HEAD
		url:'https://tonglingok.com/canteen/api/v1/food/day/handel',
=======
		url:'/api/v1/food/day/handel',
>>>>>>> dev-http
		method:'post',
		data
	});
};