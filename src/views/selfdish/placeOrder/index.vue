<template>
	<!-- 确认下单 -->
	<div style="width: auto;text-align: left;padding: 0 15px;">
		<!-- <div @click="bindToModifyAddress" @click="showPop == true"> -->
		<div @click="showPop = true">
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
		<table style="width: 100%;text-align: center;" border="1" cellspacing="0">
			<tr v-for="(item,index) in list" :key="index">
				<td width="40%">{{item.name}}</td>
				<td>{{item.count}}</td>
				<td>{{item.price * item.count}}元</td>
			</tr>
			<tr>
				<td>合计</td>
				<td></td>
				<td>{{sum}}元</td>
			</tr>
		</table>
		<div style="position: fixed;left: 10px;right: 10px; bottom: 20px;">
			<van-button type="info" size="large" @click="submit">提交</van-button>
			<van-button style="margin-top: 10px;" type="info" size="large">微信结账</van-button>
		</div>
		<van-popup v-model="showPop" position="bottom">
			<van-address-list v-model="radio" :list="address" @add="addAddress" @edit="bindToEditAddress" @select="selectAddress" />
		</van-popup>
	</div>
</template>

<script>
	import {
		getUserAddress
	} from '@/api/user.js';
	import {
		addShopOrder
	} from '@/api/store.js';
	import {
		Toast
	} from 'vant';
	// Toast.setDefaultOptions({
	// 	duration: 2000
	// });
	export default {
		data() {
			return {
				address: [], //收货地址
				def: {}, //页面显示的地址（初始为默认地址）,
				list: [], //订单清单
				sum: 0, //清单合计
				type: null, //订单类型 3:小卖部
				shop: {
					count: null, //数量
				},
				showPop: false, //展示地址选择弹窗
				radio: '', //地址选择id
			}
		},
		methods: {
			bindToModifyAddress() {
				this.$router.push({
					path: '/modifyaddress'
				});
			},
			//订单提交
			async submit() {
				if (this.type == 3) {
					//若订单类型为小卖部
					if (this.def.id != '') {
						//若取货方式为送货上门
						Toast.loading({
							message: '加载中...',
							forbidClick: true,
							duration: 0
						});
						var arry = new Array();
						for (var i = 0; i < this.shop.products.length; i++) {
							arry[i] = {
								product_id: this.shop.products[i].id,
								name: this.shop.products[i].name,
								price: this.shop.products[i].price,
								unit: this.shop.products[i].unit,
								count: this.shop.products[i].count
							};
						};
						const result = await addShopOrder({
							count: this.shop.count,
							distribution: this.shop.distribution,
							address_id: this.def.id,
							products: JSON.stringify(arry)
						});
						Toast.clear();
						if (result.errorCode == 0) {
							//提交成功
							Toast('下单成功！');
							this.$router.push('/');
						} else {
							console.log(result);
						};
					} else {
						//如果该用户还没地址
						Toast.fail('请选择地址！');
					};
				};
			},
			//新增地址
			addAddress() {
				//跳转至新增页面
				console.log('新增地址');
			},
			//编辑地址
			bindToEditAddress(e) {
				console.log('编辑地址', e);
				//跳转至编辑页面
				this.$router.push({
					name: 'editaddress',
					params: {
						data: e
					}
				});
			},
			//选择地址
			selectAddress(e) {
				this.def = e;
				this.showPop = false;
			},
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
			const data = this.$route.params;
			//若为小卖部订单
			if (data.type == 3) {
				this.type = data.type;
				this.shop = data;
				this.list = data.products;
				this.list.forEach((item, index) => {
					this.sum += item.count * item.price;
				});
			}

			//调用获取用户地址接口
			const result = await getUserAddress();
			if (result.errorCode == 0) {
				this.address = result.data
			}
			//将默认地址提取出来 
			this.address.forEach((value, index) => {
				if (value.default == 1) {
					this.radio = value.id;
					this.def = value;
				}
				//按照组件格式设置属性
				this.address[index] = Object.assign(value, {
					tel: value.phone
				});
			})
		}
	}
</script>

<style scoped>
</style>
