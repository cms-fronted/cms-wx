<template>
	<div class="content">
		<img src="../../assets/u5178.png" />
		<van-field v-model="phone" left-icon="phone-o" maxlength="11" center clearable placeholder="手机号码">
			<van-button slot="button" size="small" type="info" @click="getSmsCode">获取验证码</van-button>
		</van-field>
		<p v-if="errorMsg" style=" width: 80%; color: red;text-align: left;">{{errorMsg}}</p>
		<van-field v-model="smsCode" left-icon="qr" maxlength="4" center clearable placeholder="验证码" />
		<van-button class="mButton" type="info" size="large" @click="login">确认</van-button>
	</div>
</template>

<script>
	import {
		getSmsCode,
		bindPhone
	} from '@/api/index.js';
	import {
		Toast
	} from 'vant';

	export default {
		data() {
			return {
				phone: '',
				smsCode: '',
				errorMsg: '',
				check: false, //信息校验
			}
		},
		methods: {
			async getSmsCode() {
				console.log('发送验证码', this.phone);
				// 校验手机号号码
				if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
					this.errorMsg = '手机格式有误！';
					this.check = false;
				} else {
					this.errorMsg = '';
					this.check = true;
					Toast.loading({
						duration: 0, //设置为0不取消展示
						mask: true,
						message: '获取验证码中...'
					});
					// 此处调用获取手机验证码接口
					// const result = await getSmsCode({
					// 	"phone": this.phone
					// });
					setInterval(function() {
						Toast.clear();
					}, 3000);
				}
			},
			async login() {
				if (this.check) {
					
				}
				if (this.check && this.smsCode == '1234') {
					//调用检查验证码接口
					// const result = await bindPhone({
					// 	"phone": this.phone,
					// 	"code": this.smsCode
					// });
					Toast.loading({
						duration: 0, //设置为0不取消展示
						mask: true,
						message: '登录中...'
					});
					setInterval(function() {
						Toast.clear();
					}, 3000);
					this.$router.push('/');
				} else if (this.smsCode == '') {
					Toast.fail('验证码格式不正确');
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background-color: rgba(241, 249, 251);
		position: fixed;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.van-field {
			margin-top: 40px;
			padding: 10px 5px;
			height: 52px;
			width: 80%;
			border-radius: 10px;
			border: 1px solid rgb(191 247 243);
		}
	}

	.mButton {
		margin: 40px 0 60px 0;
		width: 80%;
		border-radius: 5px;
	}
</style>
