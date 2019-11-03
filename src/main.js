import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import Vant from 'vant';
import 'vant/lib/index.css';
import moment from 'moment';
import BScroll from 'better-scroll';
import axios from 'axios';
Vue.prototype.$moment = moment;
Vue.prototype.$http = axios;
//模块中使用

Vue.use(Vant);
Vue.use(MintUI);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
