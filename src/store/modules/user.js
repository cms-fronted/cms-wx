import {
	getcompanies,
	getUserToken,
	// bindCanteen
} from '@/api/user.js';
import { Toast } from 'vant';

const state = {
	token: 'b9b73f6ddc12636f92d5b55f38e02c7a',
	canteen_id: '',
	canteenList: [],
}

const mutations = {
	async setToken(state) {
		//调用接口获取token
		const result = await getUserToken();
		console.log(result);
		if (result.errorCode == 0) {
			state.token = result.data.token
		}
	},

	async setCanteen(state, data) {
		state.canteen_id = data
		const result = await bindCanteen({ canteen_id: data });
		Toast.success('成功进入饭堂！');
	},

	setCanteenList(state, data) {
		state.canteenList = data
	}
}

const actions = {

}

const getters = {
	tokenGetters(state) {
		return '页面渲染：' + state.token;
	},
	canteenIdGetters(state) {
		return state.canteen_id;
	},
	canteenListGetters(state) {
		return state.canteenList;
	}

}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
