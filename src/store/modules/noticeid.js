import {Toast} from 'vant'

const state = {
	map: new Map(),
};

const mutations = {
	setSId(state, data) {
		/* 
		 data格式： data:{d_ids,[s_id,s_id,s_id...]},
		 */
		if (data.list.length == 0) {
			state.map.delete(data.d_ids);
		} else {
			state.map.set(data.d_ids,data.list);
		}
	},
	clearMap(state) {
		state.map.clear();
	},
	setDId(state, data) {
		/*
		 data格式： data:[d_ids,d_ids,d_ids,...],
		 */
		console.log(data);
		if (data.length == 0) {
			
		} else {
			data.forEach((item, index) => {
				state.map.set(item, []);
			})
		}
	}
};
const getters = {
	getMap(state) {
		return state.map;
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations
}
// {
// 	"title": "国庆放假通知",
// 	"content": "国庆放假七天",
// 	"author": "张三",
// 	"d_ids": "1,2",
// 	"s_ids": "1,4",
// 	"equity_url": "http:// ",
// 	"equity_title": "国庆优惠",
// }
