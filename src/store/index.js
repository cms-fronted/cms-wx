import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import notice from './modules/notice';
import noticeid from './modules/noticeid';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		user,
		notice,
		noticeid,
	}
});
