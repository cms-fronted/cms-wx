import {
	getcompanies,
	getUserToken,
	// bindCanteen
} from '@/api/user.js';
import { Toast } from 'vant';

const state = {
	token: '7141cf9b06d47b4331fe7b8a6413be92',
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
		// const result = await bindCanteen({canteen_id:data});
		// console.log(data);
		// Toast.success('成功进入饭堂！');
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
