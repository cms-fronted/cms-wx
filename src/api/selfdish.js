import request from '@/utils/request.js';

export function getFoodList(data) {
	return request({
		url:'/v1/foods/personChoice',
		method:'get',
		data
	});
};
