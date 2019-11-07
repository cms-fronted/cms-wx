import request from '@/utils/request.js';

// 获取用户登录token
export function getUserToken() {
	return request({
		url: '/v1/token/official',
		method: 'get'
	});
};
//发送验证码
export function getSmsCode(data) {
	return request({
		url: '/v1/sms/send',
		method: 'post',
		data
	});
};

//绑定手机
export function bindPhone(data) {
	return request({
		url: '/v1/user/bindPhone',
		method: 'post',
		data
	});
};

//获取用户该饭堂电子饭卡
export function getCard(){
	return request({
		url:'/v1/user/card',
		method:'get'
	});
};

//获取所属企业列表
export function getCompanies() {
	return request({
		url: 'v1/user/companies',
		method: 'get'
	});
};
//获取用户可见模块
export function getModules() {
	return request({
		url: 'v1/modules/user',
		method: 'get'
	});
};

//用户选择进入饭堂接口
export function bindCanteen(data) {
	return request({
		url: '/v1/user/bindCanteen',
		method: 'post',
		data
	});
};

//获取用户可选择饭堂
export function canChooseCant() {
	return request({
		url: '/v1/user/canteens',
		method: 'get',
	});
};

//获取用户地址
export function getUserAddress() {
	return request({
		url: '/v1/addresses',
		method: 'get',
	});
};

//新增用户地址
export function addUserAddress(data) {
	return request({
		url: '/v1/address/save',
		method: 'post',
		data
	});
};

//更新用户地址
export function updateUserAddress(data) {
	return request({
		url: '/v1/address/update',
		method: 'post',
		data
	});
};

//用户所选饭堂可选餐次
export function getChooseDinner() {
	return request({
		url: '/v1/canteen/dinners/user',
		method: 'get'
	});
};
