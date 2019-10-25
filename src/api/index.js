import request from '@/utils/request.js';

export function getToken(data) {
	return request({
		url:'/v1/order/userOrderings',
		method: 'get',
		data
	});
}
