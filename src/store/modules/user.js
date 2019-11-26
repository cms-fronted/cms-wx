import { Toast } from 'vant';

const state = {
	canteen_id: '',
	canteenList: [],
	token: '',             //token
}

const mutations = {
	setToken(state, data) {
		state.token = data;
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
		return state.token;
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
