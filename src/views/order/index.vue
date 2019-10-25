<template>
	<!-- 订单查询 -->
	<div>
		<!-- 顶部筛选框 -->
		<div class=" shadow picker">
			<van-button class="btn" type="default" @click="typePop">{{type | typeFilter}}
				<van-icon name="arrow-down" />
			</van-button>
			<van-button class="btn" type="default" @click="addressPop">{{address}}
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
				<tr v-for="(item,index) in list" :key="index" height="80px" @click="showOrder(index)" >
					<td>{{index+1}}</td>
					<td>{{item.address}}</td>
					<td>{{item.type}}</td>
					<td>{{$moment(item.date).format('YYYY-MM-DD HH:MM')}}</td>
					<td>{{item.dinner}}</td>
					<td>{{item.money}}</td>
				</tr>
			</table>
		</div>
		<!-- 弹窗&&选择器 -->
		<van-popup v-model="addressPicker" position="bottom">
			<van-picker :columns="addressList" show-toolbar @cancel="addressPicker = false" @confirm="addressConf" />
		</van-popup>
		<van-popup v-model="typePicker" position="bottom">
			<van-picker :columns="typeList" show-toolbar @cancel="typePicker = false" @confirm="typeConf" />
		</van-popup>
		<!-- 订单详情弹窗 -->
		<van-popup class="flex-column flex-center" v-model="detailShow" :closeable="true" style="width: 90%;">
			<p style="border-bottom: 1px solid #CCCCCC;width: 100%;font-size: 14px;width: 100%;margin: 0;padding: 10px 0;">午餐</p>
			<div class="flex-column flex-center" style="width: 95%;">
				<div class="flex-row" style="justify-content: space-between;width: 80%;">
					<p>份数：</p>
					<p style="color: #EE0A24;">2份</p>
				</div>
				<table style="width: 95%;" border="1">
					<tr>
						<td>名称</td>
						<td>数量</td>
						<td>金额（元）</td>
					</tr>
					<tr v-for="(item,index) in orderDetail.foods" :key="index">
						<td>{{item.name}}</td>
						<td>{{item.count}}</td>
						<td>金额（元）</td>
					</tr>
					<tr>
						<td>合计</td>
						<td>2</td>
						<td>8</td>
					</tr>
				</table>
				<div v-if="orderDetail.address" style="font-size: 14px;width: 95%;margin: 10px;">
					<p>送餐地址</p>
					<p style="text-align: left;">{{orderDetail.address.address}}</p>
					<p style="text-align:left;color: #D7D7D7;font-size: 12px;">{{orderDetail.address.name}}
						{{orderDetail.address.phone}}</p>
					<div class="flex-row" style="justify-content: space-around;margin-top: 10px;flex-wrap: wrap;">
						<van-button type="info" @click="cancleOrder">取消订单</van-button>
						<van-button type="info">修改订单</van-button>
						<van-button type="info">修改地址</van-button>
					</div>
					<div class="flex-column flex-center" style="margin:auto;">
						<p>已绑定，扫描二维码即可消费</p>
						<img src="../../assets/code.png" style="width: 60%;margin-bottom: 20px;" />
						<span>生成日期：{{sTime}}</span>
						<span>失效日期：{{eTime}}</span>
					</div>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				//当前页码

				size: 10,
				//每页多少条数据

				type: 1,
				// 类型：1|就餐；2|外卖；3|小卖部

				id: 0,
				address: '地点',
				addressList: ['大饭堂', '小饭堂', '中饭堂'],
				typeList: ['就餐', '外卖', '小卖部'],
				typePicker: false, //类型选择器
				addressPicker: false, //地点选择器
				list: [{
					"id": 8,
					"address": "饭堂1",
					"type": "食堂",
					"create_time": "2019-09-09 16:34:15",
					"dinner": "中餐",
					"money": "10.0"
				}], //订单详情
				detailShow: false, //订单详情展示
				orderDetail: {
					"id": 8,
					"u_id": 3,
					"order_type": 1, //订单类型，饭堂订单：1|食堂，2|外卖；小卖部订单：1|到店取；2|送货上门
					"ordering_type": "personal_choice", //订单类别：shop|小卖部；personal_choice|个人选菜；online|在线订餐
					"count": 1,
					"address_id": 1,
					"state": 1,
					"foods": [{
							"detail_id": 5,
							"o_id": 8,
							"food_id": 1,
							"count": 1,
							"name": "菜品1"
						},
						{
							"detail_id": 6,
							"o_id": 8,
							"food_id": 3,
							"count": 1,
							"name": "菜品2"
						}
					],
					"address": {
						"id": 1,
						"province": "广东省",
						"city": "江门市",
						"area": "蓬江区",
						"address": "江门市白石大道东4号路3栋",
						"name": "张三",
						"phone": "18956225230",
						"sex": 1
					}
				}, //订单详情信息
				sTime: '2019/5/10 16:20:50',
				eTime: '2019/5/10 16:30:50'
			}
		},
		methods: {
			//类型&地点弹窗
			typePop() {
				this.typePicker = true;
			},
			addressPop() {
				this.addressPicker = true;
			},
			//选择器确认按钮
			typeConf(e) {
				console.log(e);
				if (e == '就餐') {
					this.type = 1;
				} else if (e == '外卖') {
					this.type = 2;
				} else {
					this.type = 3;
				};
				this.typePicker = false;
			},
			addressConf(e) {
				this.address = e;
				this.addressPicker = false;
			}, // 订单详情
			// 取消订单
			cancleOrder() {
				this.$dialog.confirm({
				  message: '确认取消该订单吗？'
				}).then(() => {
				  // on confirm
				  console.log('确认');
				}).catch(() => {
				  // on cancel
				  console.log('取消');
				});
			},
			// 显示订单详情
			showOrder(){
				this.detailShow = true;
			},
		},
		filters: {
			typeFilter(type) {
				if (type == 1) {
					return '就餐';
				} else if (type == 2) {
					return '外卖';
				} else {
					return '小卖部';
				}
			}
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
</style>
