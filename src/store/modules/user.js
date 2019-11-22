import { Toast } from 'vant';

const state = {
	token: '90a8eaab2dc71784d48ff4d897108400',
	canteen_id: '',
	canteenList: [],
}

const mutations = {
	async setToken(state) {
		state.token = result.data.token;
	},

	async setCanteen(state, data) {
		state.canteen_id = data
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
