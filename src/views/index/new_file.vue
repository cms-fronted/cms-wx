<template>
</template>

<script>
	export default {
		methods: {
			getCode() {
				window.location.href =
					"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60311f2f47c86a3e&redirect_uri=http%3A%2F%2Fyuncanteen3.51canteen.com%2Fcanteen3%2Fwxcms%2Findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
			},
			bindToWhat(phone,canteen) {
				if (phone == 2) {
					this.$router.push('entry');
				} else if (canteen == 2) {
					this.$router.push('setting');
				}else{
					this.$router.push('index');
				}
			},
			async getToken(code, state) {
				const result = await getUserToken({
					code: code,
					state: state
				});
				if(result.errorCode == 0){
					this.$store.commit('user/setToken', result.data.token);
					this.$store.commit('user/setCanteen', result.data.canteen_id);
					window.localStorage.setItem('token', result.data.token);
					window.localStorage.setItem('phone', result.data.phone);
					window.localStorage.setItem('canteen_selected', result.data.canteen_selected);
					window.localStorage.setItem('canteen_id', result.data.canteen_id);
				}
			}
		},
		created() {
			const phone = window.localStorage.getItem('phone');
			const canteen_selected = window.localStorage.getItem('canteen_selected');
			const canteen_id = window.localStorage.getItem('canteen_id');
			const token = window.localStorage.getItem('token');
			const params = new URLSearchParams(window.location.search.substring(1)); //查询url
			const code = params.get("code"); //获取url中的code
			const state = params.get("state");
			if (!token && !code && !state) {
				//第一次进入 获取授权
				this.getCode()
			} else if (!token && code && state) {
				//授权重定向
				this.getToken(code,state);
				//修改当前url 使得刷新当前页面不再获取微信授权
				
				this.$router.push('index');
			}else if(token && code && state){
				//非第一次进入 非重定向进入
				this.bindToWhat(phone,canteen_selected)
				this.$store.commit('user/setToken', token);
			}
		}
	}
</script>

<style>
</style>
