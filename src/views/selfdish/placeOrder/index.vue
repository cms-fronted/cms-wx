<template>
	<!-- 确认下单 -->
	<div style="width: auto;text-align: left;padding: 0 15px;">
		<div @click="bindToModifyAddress">
			<h3 v-if="address.length==0" style="font-size: 16px;color: #BCBCBC;margin: 10px 0;">你还没添加地址哦，请先添加收货地址</h3>
			<h3 v-else>{{def.address}}</h3>
			<van-icon style="margin-left: 90%;" name="arrow" />
			<p style="font-size: 12px;margin: 0;border-bottom:1px solid #CCCCCC;">{{def.name}}{{def.sex | sexFilter}}
				{{def.phone}}</p>
		</div>
		<div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
			<h4>饭点时间送出</h4>
			<van-icon name="arrow" />
		</div>
		订餐清单
		<table style="width: 100%;" border="1">
			<tr>
				<td width="40%">红烧牛肉</td>
				<td>1份</td>
				<td>5元</td>
			</tr>
			<tr>
				<td>耗油菜心</td>
				<td>1份</td>
				<td>2元</td>
			</tr>
			<tr>
				<td>合计</td>
				<td></td>
				<td>7元</td>
			</tr>
		</table>
		<div style="position: fixed;left: 10px;right: 10px; bottom: 20px;">
			<van-button type="info" size="large">提交</van-button>
			<van-button style="margin-top: 10px;" type="info" size="large">微信结账</van-button>
		</div>
	</div>
</template>

<script>
	import {
		getUserAddress
	} from '@/api/user.js';

	export default {
		data() {
			return {
				address: [], //收货地址
				def: {}, //默认地址
			}
		},
		methods: {
			bindToModifyAddress() {
				this.$router.push({
					path: '/modifyaddress'
				});
			}
		},
		filters: {
			sexFilter(value) {
				if (value == 1) {
					return '（先生）';;
				} else if (value == 0) {
					return '（女士）';
				};
				return '';
			}
		},
		async created() {
			//调用获取用户地址接口
			const result = await getUserAddress();
			if (result.errorCode == 0) {
				this.address = result.data
			}

			this.address.forEach((value, index) => {
				if (value.default == 1) {
					this.def = value;
				}
			})
		}
	}
</script>

<style scoped>
</style>
