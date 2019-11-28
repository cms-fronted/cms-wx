import { Toast } from 'vant';

const state = {
	canteen_id: '',
	canteenList: [],
	canteen_selected: '',
	phone: '',
	token: localStorage["user_token"] ? localStorage["user_token"] : "",             //token
}

const mutations = {
	setToken(state, data) {
		state.token = data;
		localStorage.setItem("user_token", data)
	},
	setCanteen(state, data) {
		state.canteen_id = data
		localStorage.setItem('canteen_id', data)
	},
	setCanteenList(state, data) {
		state.canteenList = data
	},
	setCanteenSelect(state, data) {
		state.canteen_selected = data
		localStorage.setItem("canteen_selected", data)
	},
	setPhone(state, data) {
		state.phone = data
		localStorage.setItem('phone', data)
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
	},
	getCanteenSelected(state) {
		return state.canteen_selected
	},
	getPhoneBind(state) {
		return state.phone
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
