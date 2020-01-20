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
import VConsole from 'vconsole';

(function () {
	let time = 0;
	setInterval(() => {
		time = 0;
	}, 1000)
	if (time == 6) {
		let vConsole = new VConsole();
	}
})()
Vue.prototype.$moment = moment;


Vue.use(Vant);
Vue.use(MintUI);

// 解决移动端滑动后触发 touchend事件
function stopTouchendPropagationAfterScroll() {
	var locked = false;

	// window.addEventListener('touchmove', function (ev) {
	// 	locked || (locked = true, window.addEventListener('touchend', stopTouchendPropagation, true));
	// }, true);
	function stopTouchendPropagation(ev) {
		ev.stopPropagation();
		window.removeEventListener('touchend', stopTouchendPropagation, true);
		locked = false;
	}
}
stopTouchendPropagationAfterScroll();
const _bus = new Vue()
_bus.install = function (Vue) { //注册、监听、触发全局事件
	Vue.prototype.$bus = Vue.prototype.bus = _bus
}
moment.locale('en', {
	weekdaysShort: ["日", "一", "二", "三", "四", "五", "六"]
});
Vue.use(_bus);

Vue.config.productionTip = false;

// 路由拦截器
// router.beforeEach((to,from,next)=>{
// 	const token = localStorage.getItem('token');
// 	const openid= localStorage.getItem('openid');
// 	if(!openid && !token){
// 		next()
// 	}else{
// 		localStorage.setItem('now_url',to.fullPath)
// 	}
// })

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
