import {
	getcompanies,
	getUserToken
} from '@/api/user.js'

const state = {
	token: '7fa25d9bfc7278c079126d013ba4e6e0',
	canteen_id: ''
}

const mutations = {
	async setToken(state) {
		//调用接口获取token
		const result = await getUserToken();
		console.log(result);
		if (result.errorCode == 0) {
			state.token = result.data.token
		}
		// state.token = '11111';
	},

	setCanteen(state, data) {
		state.canteen_id = data
	}
}

const actions = {

}

const getters = {
	tokenGetters(state) {
		console.log('1123456');
		return '页面渲染：' + state.token;
	},
	canteenIdGetters(state) {
		return '饭堂：' + state.canteen_id;
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
