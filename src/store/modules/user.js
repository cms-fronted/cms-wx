import { Toast } from 'vant';

const state = {
	// token: '4626773b1095c517bc33d071626a7c74',
	token: '',
	canteen_id: '',
	canteenList: [],
	token: localStorage['site_current_token'] ? localStorage['site_current_token'] : '',             //token
	account_id: localStorage['site_current_account_id'] ? localStorage['site_current_account_id'] : 0,       //当前account_id
	app_id: localStorage['site_current_app_id'] ? localStorage['site_current_app_id'] : '',          //当前 app_id
	retry_count: 0,//登录重试次数,防止同一页面中多个ajax同时触发登录操作
	after_login_go: localStorage['site_current_login_go'] ? localStorage['site_current_login_go'] : '',//登录后跳转
}

const mutations = {
	setToken(state, data) {
		state.token = data
		localStorage.setItem("site_current_token", data)
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
