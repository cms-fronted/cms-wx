<template>
	<!-- 消费查询 -->
	<div>
		<!-- 顶部条件选择 -->
		<div class=" shadow picker">
			<van-button class="btn" type="default" @click="timePop">{{$moment(currentDate).format('YYYY-MM')}}
				<van-icon name="arrow-down" />
			</van-button>
			<p v-if="balance.hidden==2" class="btn" style=" margin: auto; font-size: 20px;color: #EE0A24;">余额：{{balance.money}}元</p>
		</div>
		<!-- 消费记录表格 -->
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<div class="flex-row flex-center" style="width: 100%;margin-top: 20px;">
				<table style="width: 95%;height: auto;" border="1" cellpadding="0" cellspacing="0">
					<tr height="60px">
						<td width="5%">序号</td>
						<td width="15%">地点</td>
						<td width="15%">类型</td>
						<td width="20%">消费日期</td>
						<td width="20%">餐次日期</td>
						<td>名称</td>
						<td width="5%">金额（元）</td>
					</tr>
					<tr v-for="(item,index) in list" :key="index" @click="detail(item)" height="90px">
						<td>{{index+1}}</td>
						<td>{{item.location}}</td>
						<td>{{item.used_type}}</td>
						<td>{{$moment(item.create_time).format('YYYY-MM-DD HH:MM')}}</td>
						<td>{{item.ordering_date=='/'? '/':$moment(item.ordering_date).format('YYYY-MM-DD HH:MM')}}</td>
						<td>{{item.dinner}}</td>
						<td>{{item.money}}</td>
					</tr>
				</table>
			</div>
		</van-list>
		<!-- 月消费合计 -->
		<div style="text-align: right;line-height: 40px; font-size: 20px;color: #EE0A24;margin-right: 20px;">
			<p>月消费合计：{{totalAmount}}元</p>
		</div>
		<!-- 详情弹窗 -->
		<van-popup class="flex-column flex-center" v-model="detailPop" :closeable="true" :close-on-click-overlay="false"
		 style="width: 90%;" @close="closePop">
			<div v-if="detailPop" class="flex-column flex-center" style="width:95%;">
				<p style="line-height: 25px;border-bottom: 1px solid #CCCCCC;width: 100%;">午餐</p>
				<table style="width: 90%;margin-bottom: 30px;" border="1" cellpadding="0" cellspacing="0">
					<tr style="height: 50px;">
						<td>名称</td>
						<td>数量</td>
						<td>金额（元）</td>
					</tr>
					<tr v-for="(items,index) in detailList.foods" :key="index">
						<td>{{items.name}}</td>
						<td>{{items.count}}</td>
						<td>{{items.price}}</td>
					</tr>
					<tr style="background-color: #26A2FF;">
						<td>合计</td>
						<td>{{sumQuantity}}</td>
						<td>{{sumAmount}}</td>
					</tr>
				</table>

				<div v-if="detailList.order_type ==1" style="text-align: left;width: 80%;margin-bottom: 20px;">
					<p style="text-align: center;">送餐地址</p>
					<p style="font-size: 14px;">{{detailList.address.address}}</p>
					<p style="font-size:12px ;color: #D7D7D7;">{{detailList.address.name}} {{detailList.address.phone}}</p>
				</div>
			</div>
		</van-popup>

		<!-- 弹出层&&选择器 时间 地点 类型 -->
		<van-popup v-model="picker1" position="bottom">
			<van-datetime-picker v-model="date" type="year-month" @cancel="picker1 = false" @confirm="timeConf" />
		</van-popup>
	</div>
</template>

<script>
	import {
		getConsumptionRecords,
		getConsumeDetail
	} from '@/api/consume.js';
	import {
		Toast
	} from 'vant';

	export default {
		data() {
			return {
				list: [], //消费列表
				currentDate: new Date(),
				date: new Date(),
				totalAmount: 0, //月消费总金额
				balance: {}, //余额信息
				paging: {
					total: 0,
					per_page: 15,
					current_page: 1,
					last_page: null,
				}, // 消费查询分页
				picker1: false,
				detailPop: false, //详情弹窗
				detailList: {}, //消费详情
				sumQuantity: 0, //弹窗数量合计
				sumAmount: 0, //弹窗金额合计
				loading: false,
				finished: false
			}
		},
		methods: {
			closePop() {
				this.sumAmount = 0;
				this.sumAmount = 0;
			},
			timePop() {
				this.picker1 = true;
			},
			async timeConf(e) {
				Toast.loading({
					forbidClick: true,
					duration: 0
				});
				this.currentDate = e;
				//数据初始化
				this.list = [];
				const result = await getConsumptionRecords({
					consumption_time: this.$moment(this.currentDate).format('YYYY-MM'),
					page: this.paging.current_page,
					size: this.paging.per_page
				});
				if (result.errorCode == 0) {
					this.list = result.data.records.data;
					this.totalAmount = result.data.consumptionMoney; //月消费金额
					this.balance = result.data.balance
					this.paging = result.data.records;
				};
				this.picker1 = false;
				Toast.clear();
			},
			/* 消费详情 */
			async detail(e) {
				Toast.loading({
					forbidClick: true,
					duration: 0
				});
				const result = await getConsumeDetail({
					order_type: e.order_type,
					order_id: e.order_id
				});
				if (result.errorCode == 0) {
					this.detailList = result.data
					if (this.detailList.foods.length > 0) {
						var sumAmount = 0;
						var sumQuantity = 0;
						this.detailList.foods.forEach((item, index) => {
							sumAmount += parseInt(item.price);
							sumQuantity += item.count;
						});
						this.sumAmount = sumAmount;
						this.sumQuantity = sumQuantity;
					};
				};
				this.detailPop = true;
				Toast.clear()
			},
			async onLoad() {
				if (this.paging.current_page == this.paging.last_page) {
					this.finished = true;
				} else if (this.paging.total != 0) {
					this.paging.current_page += 1;
					const result = await getConsumptionRecords({
						consumption_time: this.$moment(this.currentDate).format('YYYY-MM'),
						page: this.paging.current_page,
						size: this.paging.per_page
					});
					if (result.errorCode == 0) {
						this.list = result.data.records.data;
						this.totalAmount = result.data.consumptionMoney; //月消费金额
						this.balance = result.data.balance
						this.paging = result.data.records;
					};
					this.loading = false;
				};
				// 加载状态结束
				this.loading = false;
			}
		},
		async created() {
			Toast.loading({
				forbidClick: true,
				duration: 0
			});
			//数据初始化
			const result = await getConsumptionRecords({
				consumption_time: this.$moment(this.currentDate).format('YYYY-MM'),
				page: this.paging.current_page,
				size: this.paging.per_page
			});
			console.log('初始化：', result);
			if (result.errorCode == 0) {
				this.list = result.data.records.data;
				this.totalAmount = result.data.consumptionMoney; //月消费金额
				this.balance = result.data.balance
				this.paging = result.data.records;
			};
			Toast.clear();
		},
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
