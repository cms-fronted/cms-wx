import { Toast } from 'vant';

const state = {
	token: '4626773b1095c517bc33d071626a7c74',
	canteen_id: '',
	canteenList: [],
}

const mutations = {
	setToken(state, data) {
		state.token = data
	},

	setCanteen(state, data) {
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
