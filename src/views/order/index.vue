<template>
	<!-- 订单查询 -->
	<div>
		<!-- 顶部筛选框 -->
		<div class=" shadow picker">
			<van-button class="btn" type="default" @click="typePicker = true;">{{type | typeFilter}}
				<van-icon name="arrow-down" />
			</van-button>
			<van-button class="btn" type="default" @click="addressPicker = true;">{{address}}
				<van-icon name="arrow-down" />
			</van-button>
		</div>
		<!-- 列表 -->
		<div class="flex-row flex-center" style="width: 100%;margin-top: 20px;">
			<table style="width: 95%;" border="1" cellpadding="0" cellspacing="0">
				<tr style="height: 60px;background-color: #26A2FF;">
					<td width="10%">序号</td>
					<td>地点</td>
					<td>类型</td>
					<td width="30%">日期</td>
					<td>名称</td>
					<td width="20%">金额（元）</td>
				</tr>
				<tr v-for="(item,index) in list" :key="index" height="80px" @click="showOrder(item)">
					<td>{{index+1}}</td>
					<td>{{item.address}}</td>
					<td>{{item.type}}</td>
					<td>{{item.create_time}}</td>
					<td>{{item.dinner}}</td>
					<td>{{item.money}}</td>
				</tr>
			</table>
		</div>
		<!-- 弹窗&&选择器 -->
		<van-popup v-model="addressPicker" :close-on-click-overlay="false" position="bottom">
			<van-picker :columns="addressList" show-toolbar @cancel="addressPicker = false" @confirm="addressConf" />
		</van-popup>
		<van-popup v-model="typePicker" :close-on-click-overlay="false" position="bottom">
			<van-picker :columns="typeList" show-toolbar @cancel="typePicker = false" @confirm="typeConf" />
		</van-popup>
		<!-- 订单详情弹窗 -->
		<van-popup class="flex-column flex-center" v-model="detailShow" :closeable="true" :close-on-click-overlay="false" style="width: 90%;">
			<p style="border-bottom: 1px solid #CCCCCC;width: 100%;font-size: 14px;width: 100%;margin: 0;padding: 10px 0;">午餐</p>
			<div class="flex-column flex-center" style="width: 95%;">
				<div class="flex-row" style="justify-content: space-between;width: 80%;">
					<p>份数：</p>
					<p style="color: #EE0A24;">{{this.orderDetail.count}}份</p>
				</div>
				<table style="width: 95%;" border="1">
					<tr>
						<td>名称</td>
						<td>单位</td>
						<td>数量</td>
						<td>金额（元）</td>
					</tr>
					<tr v-for="(item,index) in orderDetail.foods" :key="index">
						<td>{{item.name}}</td>
						<td>{{item.unit}}</td>
						<td>{{item.count}}</td>
						<td>{{item.count * parseFloat(item.price)}}（元）</td>
					</tr>
					<tr>
						<td>合计</td>
						<td></td>
						<td>{{detailCount}}</td>
						<td>{{detailAmount}}(元)</td>
					</tr>
				</table>
				<div v-if="orderDetail.address" style="font-size: 14px;width: 95%;margin: 10px;">
					<div style="border:1px solid #F2F3F5;">
						<p style="border-bottom:1px solid #F2F3F5;">送餐地址</p>
						<p style="text-align: left;">{{orderDetail.address.address}}</p>
						<p style="text-align:left;color: #D7D7D7;font-size: 12px;">{{orderDetail.address.name}}
							{{orderDetail.address.phone}}</p>
					</div>
					<div class="flex-row" style="justify-content: space-around;margin-top: 10px;flex-wrap: wrap;">
						<van-button type="info" @click="cancleOrder">取消订单</van-button>
						<van-button type="info" @click="editOrder">修改订单</van-button>
						<van-button type="info" @click="editAddress">修改地址</van-button>
					</div>
					<div class="flex-column flex-center" style="margin:auto;">
						<p>已绑定，扫描二维码即可消费</p>
						<img :src="shopCode" style="width: 60%;margin-bottom: 20px;" />
						<!-- <span>生成日期：{{sTime}}</span> -->
						<!-- <span>失效日期：{{eTime}}</span> -->
					</div>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import {
		canChooseCant
	} from '@/api/user.js';
	import {
		userOrderings,
		getOrderDetail,
		cancelOrder,
		deliveryCode
	} from '@/api/order.js';
	import {
		Toast
	} from 'vant';
	export default {
		data() {
			return {
				page: 1, //当前页码
				size: 10, //每页多少条数据
				type: 0, // 类型：1|就餐；2|外卖；3|小卖部
				addressId: null, //饭堂id 或企业id
				address: '请选择地点', //地点
				addressList: [], //地点列表
				typeList: ['就餐', '外卖', '小卖部'],
				typePicker: false, //类型选择器
				addressPicker: false, //地点选择器
				list: [],
				detailShow: false, //订单详情展示
				orderDetail: {}, //订单详情信息
				sTime: '2019/5/10 16:20:50',
				eTime: '2019/5/10 16:30:50',
				place: [], //用户可选地址
				orderDetailCount: {}, //订单总数查询
				shopCode: '', //小卖部提货码
			}
		},
		methods: {
			//选择器确认按钮
			typeConf(e) {
				if (e == '就餐') {
					this.type = 1;
				} else if (e == '外卖') {
					this.type = 2;
				} else {
					this.type = 3;
				};
				this.address = '请选择地点';
				this.typePicker = false;
				this.$dialog.confirm({
					title: '提示',
					message: '请选择地点进行查询',
					'close-on-click-overlay': true
				});
			},
			//确认并获取订单列表
			async addressConf(e) {
				Toast.loading({
					message: '获取订单信息中...',
					forbidClick: true
				});
				if (this.type == 3) {
					this.place.forEach((items, index) => {
						if (items.company.name == e) {
							this.addressId = items.company_id
						};
					});
				} else if (this.type == 1 && this.type == 2) {
					this.place.forEach((items, index) => {
						items.canteens.forEach((item, key) => {
							if (item.info.name == e) {
								this.addressId == item.canteen_id
							};
						});
					});
				};
				this.address = e;
				this.addressPicker = false;

				//调用获取订单列表接口
				const data = {
					page: this.page,
					size: this.size,
					type: this.type,
					id: this.addressId
				}
				const result = await userOrderings(data);
				console.log('订单列表：', result);
				if (result.errorCode == 0) {
					this.list = result.data.data
				}
				Toast.clear();
			},
			// 取消订单
			cancleOrder() {
				this.$dialog.confirm({
					title: '取消订单',
					message: '确认取消该订单吗?'
				}).then(() => {
					// on confirm
					//调用取消订单接口
					cancelOrder({
						id: this.orderDetail.id
					}).then(result => {
						console.log('确认:', result);
					});
				}).catch(() => {
					// on cancel
					console.log('取消');
				});
			},
			// 显示订单详情
			async showOrder(e) {
				Toast.loading({
					message:'加载中...',
					forbidClick:true,
					duration:0
				});
				//调用获取订单的详情
				const result = await getOrderDetail({
					type: this.type,
					id: e.id
				});
				console.log(result);
				if (result.errorCode == 0) {
					this.orderDetail = result.data;
				};
				const result2 = await deliveryCode({
					id: e.id
				});
				if (result2.errorCode == 0) {
					this.shopCode = 'http://canteen.tonglingok.com/' + result2.data.url
				};
				this.detailShow = true;
				Toast.clear();
			},
			//修改订单
			editOrder() {
				if (this.orderDetail.used == 1) {
					this.$dialog.alert({
						message: '该订单无法修改'
					});
				} else {
					//跳转至小卖部订单修改
					this.$dialog.alert({
						message: '跳转小卖部订单修改'
					});
				}
			},
			//修改地址
			editAddress() {
				if (this.orderDetail.used == 1) {
					this.$dialog.alert({
						message: '该订单无法修改'
					});
				} else {
					//跳转至地址修改
					this.$dialog.alert({
						message: '跳转地址修改'
					});
				}
			}
		},
		filters: {
			typeFilter(type) {
				if (type == 1) {
					return '就餐';
				} else if (type == 2) {
					return '外卖';
				} else if (type == 3) {
					return '小卖部';
				}
				return '请选择类型';
			}
		},
		watch: {
			type(e) {
				if (e == 3) {
					//初始化地点选项
					this.addressList = []
					this.place.forEach((item, index) => {
						this.addressList[index] = this.place[index].company.name
					});
				} else {
					//初始化地点选项
					this.addressList = []
					this.place.forEach((items, index) => {
						items.canteens.forEach((item, key) => {
							this.addressList[key] = item.info.name
						});
					});
				}
			}
		},
		computed: {
			detailCount() {
				var sum = 0;
				if (this.orderDetail.foods) {
					this.orderDetail.foods.forEach((item, index) => {
						sum = sum + item.count;
					});
				};
				return sum;
			},
			detailAmount() {
				var sum = 0;
				if (this.orderDetail.foods) {
					this.orderDetail.foods.forEach((item, index) => {
						sum = (parseFloat(item.price) * item.count) + sum;
					});
				};
				return sum;
			}
		},
		async created() {
			//调用用户可进入饭堂接口获取地点数据
			const result = await canChooseCant();
			if (result.errorCode == 0) {
				this.place = result.data;
			};
			//初始化
			// if (!this.list.length) {
			// 	this.$dialog.confirm({
			// 		title: '提示',
			// 		message: '请选择订单查询条件',
			// 		'close-on-click-overlay':true
			// 	}).then(() => {
			// 		// on confirm
			// 		this.typePicker = true;
			// 	}).catch(() => {
			// 		// on cancel
			// 		this.typePicker = true;
			// 	});
			// }
			//调用获取订单列表接口
			// const result2 = await userOrderings({})
		}
	}
</script>

<style lang="scss" scoped>
	.picker {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		.btn {
			width: 40%;
			border-radius: 10px;
			margin: 10px 5%;
		}
	}

	p {
		margin: 10px 0;
	}
</style>
