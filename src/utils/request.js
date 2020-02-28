import axios from 'axios'
import {
	Dialog
} from 'vant'
import store from '@/store'
import {
	Toast
} from 'vant'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
	// baseURL: 'https://tonglingok.com/canteen/api/', // api 的 base_url
	// withCredentials: true, // 跨域请求时发送 cookies
	timeout: 15000, // request timeout

})

// request interceptor
service.interceptors.request.use(
	config => {
		const token = store.state.user.token;
		// Do something before request is sent
		if (token) {
			// 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
			config.headers.token = token
		}
		return config
	},
	error => {
		// Do something with request error
		console.log(error) // for debug
		return error
		// return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	/**
	 * If you want to get information such as headers or status
	 * Please return  response => response
	 */
	/**
	 * 下面的注释为通过在response里，自定义code来标示请求状态
	 * 当code返回如下情况则说明权限有问题，登出并返回到登录页
	 * 如想通过 XMLHttpRequest 来状态码标识 逻辑可写在下面error中
	 * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
	 */
	response => {
		const res = response.data
		if (res.errorCode === 0) {
			Toast.clear();
			return res;
		 }
		else if (res.errorCode == 10001) {
<<<<<<< HEAD
			window.location.href =
				"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60311f2f47c86a3e&redirect_uri=https%3A%2F%2Fcloudcanteen3.51canteen.com%2Fcanteen3%2Fwxcms%2F%23%2Fauthor&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
=======
				window.location.href =
					"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60311f2f47c86a3e&redirect_uri=https%3A%2F%2Fcloudcanteen3.51canteen.com%2Fcanteen3%2Fwxcms%2F%23%2Fauthor&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
>>>>>>> dev-http
		}
		else {
			console.log('错误码：', res.errorCode);
			Toast.clear();
			Dialog.alert({
				title: '错误',
				message: res.msg
			}).then(() => {
				// on close
			});
			// // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
			// if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
			//   // 请自行在引入 MessageBox
			//   // import { Message, MessageBox } from 'element-ui'
			//   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
			//     confirmButtonText: '重新登录',
			//     cancelButtonText: '取消',
			//     type: 'warning'
			//   }).then(() => {
			//     store.dispatch('user/resetToken').then(() => {
			//       location.reload() // 为了重新实例化vue-router对象 避免bug
			//     })
			//   })
			// }
			return res
			// return Promise.reject(res.msg)
		}
	},
	error => {
		console.log('err:' + error) // for debug
		Toast.clear();
		Dialog.alert({
			title: '请求错误',
			message: error
		}).then(() => {
			// on close
		});
		// Message({
		//   message: '请求出错',
		//   type: 'error',
		//   duration: 5 * 1000
		// })
		return error
		// return Promise.reject(error)
	}
)

export default service
