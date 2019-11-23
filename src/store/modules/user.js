import { Toast } from 'vant';

const state = {
	token: 'e153a1ade59c76f23eb357cb0406ba4c',
	canteen_id: '',
	canteenList: [],
}

const mutations = {
	async setToken(state, data) {
		state.token = data
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
