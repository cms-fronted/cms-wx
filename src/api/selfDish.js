import request from '@/utils/request.js';
import QS from "qs";

//获取商品列表
export function getFoodList(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/foods/personChoice',
		method: 'get',
		params: data
	});
};

//获取当前饭堂就餐类型
export function getDiningType() {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/canteen/diningMode',
		method: 'get'
	});
};

//菜谱查询
export function getMenuQuery(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/foods/menu',
		method: 'get',
		params: data
	});
};

//获取菜品评论信息
export function getComments(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/food/info/comment',
		method: 'get',
		params: data
	});
};

//菜品评论提交
export function saveFoodComment(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/food/saveComment',
		method: 'post',
		data
	});
};

//饭堂评论提交
export function saveCanteenComment(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/canteen/saveComment',
		method: 'post',
		data
	});
};

//提交订单 http://canteen.tonglingok.com/api/v1/order/personChoice/save
export function saveOrder(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/order/personChoice/save',
		method: 'post',
		data: QS.stringify(data)
	});
};

//获取饭堂餐次配置信息
export function getDinnerInfo(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/order/personChoice/info',
		mathod: 'get',
		params: data
	});
};

//修改订单菜品信息
export function changeFoods(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/order/changeFoods',
		method: 'post',
		data
	});
};

//修改订单地址
export function changeOrderAddress(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/order/changeAddress',
		method: 'post',
		data
	})
}