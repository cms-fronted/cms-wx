import {
	getcompanies,
	getUserToken,
	bindCanteen
} from '@/api/user.js';
import {Toast} from 'vant';

const state = {
	token: '2bfcbc72c20abadec6668d911040c4b3',
	canteen_id: 7,
	canteenList:[],
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

	async setCanteen(state, data) {
		state.canteen_id = data
		const result = await bindCanteen({canteen_id:data});
		// console.log(data);
		Toast.success('成功进入饭堂！');
	},
	
	setCanteenList(state,data){
		state.canteenList = data
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
		return state.canteen_id;
	},
	canteenListGetters(state){
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
