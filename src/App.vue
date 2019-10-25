<template>
	<div id="app">
		<!-- 饭堂选择下拉箭头 -->
		<van-icon style="position: fixed;right: 10px;top: 40px;z-index: 10;" size="40px" name="arrow-down" @click="chooseCanteen" />
		<!-- 导航栏 -->
		<mt-header title="哈哈哈哈" style="padding:0;">
			<div @click="back" slot="left" v-show="isShow">
				<mt-button icon="back">返回</mt-button>
			</div>
		</mt-header>
		<!-- 饭堂选择 -->
		<div class="shadow" style="margin-bottom: 10px;" v-bind:hidden="show">
			<van-radio-group v-model="radio" style="width: 100%;display: flex;flex-wrap: wrap;padding-top: 35px">
				<van-radio class="flex-row flex-center" :name="index" icon-size="12px" v-for="(item,index) in 6" :key="index" style="width: 33%; margin: 10px 0">A饭堂</van-radio>
			</van-radio-group>
		</div>
		<!-- <van-popup v-model="show" :overlay="false" position="top"  style="margin-top: 40px;" closeable :lock-scroll="false" >
			
		</van-popup> -->
		<router-view />
	</div>
</template>
<script>
	import {mapGetters} from 'vuex'
	import {getUserToken} from './api/user.js'
	export default {
		data() {
			return {
				isShow: false,
				show: true,
				radio: ''
			}
		},
		methods: {
			chooseCanteen() {
				this.show = !this.show
			},
			back() {
				this.$router.go(-1);
			}
		},
		watch: {
			$route(now, old) {
				if (now.name == 'index' || now.name == 'entry') {
					this.isShow = false;
				} else {
					this.isShow = true;
				};
			}
		},
		async created() {
			// this.$store.commit('user/setToken');
			//获取用户信息判断该用户是否绑定手机或饭堂
			// const result = await getUserToken();
			const result = {data:{"token":"35fd062c8b2c546c2a684f506ba21cb5","phone":1,"canteen_selected":2}}
			console.log(result);
			if(result.data.phone == 2){
				//用户未绑定手机
				this.$router.push('entry');
			}else if(result.data.canteen_selected == 1){
				//已选择饭堂跳至首页
				
			}else if(result.data.canteen_selected == 2){
				//未选择饭堂调用接口获取可选择饭堂
			}
		},
		computed:{
			...mapGetters('user',{
				token:'tokenGetters'
			})
		}
		
	}
</script>
<style lang="scss">
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;

		mt-header {
			position: fixed;
		}
	}

	#nav {
		padding: 30px;

		a {
			font-weight: bold;
			color: #2c3e50;

			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}

	body {
		width: 100%;
		height: 100%;
		position: relative;
		background-color: #FFFFFF;
		margin: 0;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}

	.flex-center {
		justify-content: center;
		align-items: center;
	}

	.shadow {
		box-shadow: 5px 5px 10px 0px #ccc;
	}

	.mIcon {
		position: absolute;
		top: 50%;
		right: -4px;
		margin-top: -5px;
		margin-right: 15px;
		border: 3px solid;
		border-color: transparent transparent currentColor currentColor;
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
		opacity: .8;
		content: '';
	}

	.myBtn {
		border-radius: 10px !important;
		width: 100px;
	}
</style>
