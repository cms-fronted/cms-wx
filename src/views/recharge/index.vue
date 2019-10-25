<template>
	<!-- 微信充值 -->
	<div class="flex-column" style="margin-top: 20px;">
		<van-cell-group>
			<van-field v-model="phone" label="手机号码" />
			<van-field v-model="amount" label="充值金额" placeholder="请输入10的倍数的金额" label-align='left' />
		</van-cell-group>
		<div style="position: fixed; bottom: 0;width: 90%;padding: 90px 5%;">
			<van-button type="primary" size="large" @click="show = true">充值</van-button>
		</div>

		<van-dialog v-model="show" title="充值确认" show-cancel-button @comfirm='recharge' @cancel="cancel">
			<div style="padding-left: 30px;text-align: left;">
				<p>姓名：{{name}}</p>
				<p>手机号码：{{phone}}</p>
				<p>充值金额：{{amount}} </p>
			</div>
		</van-dialog>
	</div>
</template>
<script>
	import {
		Dialog
	} from 'vant';

	export default {
		data() {
			return {
				phone: '15521323081',
				amount: 0,
				show: false,
				name: '陈琅斌'
			}
		},
		methods: {
			recharge() {
				console.log('充值！');
			},
			cancel() {
				console.log("取消充值!");
			}
		}
	}
</script>

<style scoped>

</style>
