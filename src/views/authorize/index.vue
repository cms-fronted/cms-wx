<template>
	<div>

	</div>
</template>

<script>
	import mapGetters from 'vuex';
	import {
		Toast
	} from 'vant';

	export default {
		data() {
			return {
			
			}
		},
		method: {
			/* 获取 token 并作相应的处理 */
			async getToken(code, state) {
				const result = await getUserToken({
					code: code,
					state: state
				});
				if (result.errorCode == 0) {
					//存起token phone canteen_selected
					store.commit("user/setToken", result.data.token);
					window.localStorage.setItem('token', result.data.token);
					window.localStorage.setItem('phone', result.data.phone);
					window.localStorage.setItem('canteen_selected', result.data.canteen_selected);

					if (result.data.phone == 2) {
						//未绑定手机 进入绑定手机页面
						this.$router.push("entry");
					} else if (result.data.canteen_selected == 2) {
						//未选择饭堂 进入饭堂选择页面
						this.$router.push("setting");
					} else {
						//缓存已选饭堂
						window.localStorage.setItem('canteen_id', result.data.canteen_id);
						store.commit("user/setCanteen", result.data.canteen_id);
						/* 获取用户可选饭堂 */
						var canteens = [];
						const result2 = await canChooseCant();
						if (result2.errorCode == 0) {
							result2.data.forEach((items, index) => {
								items.canteens.forEach((item, key) => {
									canteens.push(item.info);
								});
							});
							this.$store.commit("user/setCanteenList", canteens);
						};
						this.$router.push('index');
					};
				};
			}
		},
		computed: {

		},
		created() {
			const params = new URLSearchParams(window.location.search.substring(1));
			//找到第一个出现的code state
			const code = params.get('code');
			const state = params.get('state');
			if (code && state) {
				Toast.loading({
					forbidClick: true,
					duration: 0
				});
				this.getToken(code, state);
				Toast.clear();
			}
		}
	}
</script>

<style>
</style>
