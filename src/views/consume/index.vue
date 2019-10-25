<template>
	<!-- 消费查询 -->
	<div>
		<!-- 顶部条件选择 -->
		<div class=" shadow picker">
			<van-button class="btn" type="default" @click="timePop">{{$moment(currentDate).format('YYYY-MM')}}
				<van-icon name="arrow-down" />
			</van-button>
			<van-button class="btn" type="default" @click="placePop">{{place}}
				<van-icon name="arrow-down" />
			</van-button>
			<van-button class="btn" type="default" @click="typePop">{{type}}
				<van-icon name="arrow-down" />
			</van-button>
			<p class="btn" style=" margin: auto; font-size: 20px;color: #EE0A24;">余额：50元</p>
		</div>
		<!-- 消费记录表格 -->
		<div class="flex-row flex-center" style="width: 100%;margin-top: 20px;">
			<table style="width: 95%;height: 400px;" border="1">
				<tr>
					<td width="10%">序号</td>
					<td>地点</td>
					<td>类型</td>
					<td width="30%">日期</td>
					<td>名称</td>
					<td width="20%">金额（元）</td>
				</tr>
				<tr v-for="(item,index) in list" :key="index" @click="detail(item.detail)">
					<td>{{index+1}}</td>
					<td>{{item.place}}</td>
					<td>{{item.type}}</td>
					<td>{{$moment(item.date).format('YYYY-MM-DD HH:MM')}}</td>
					<td>{{item.name}}</td>
					<td>{{item.amount}}</td>
				</tr>
			</table>
		</div>
		<!-- 月消费合计 -->
		<div style="text-align: right;line-height: 40px; font-size: 20px;color: #EE0A24;margin-right: 20px;">
			<p>月消费合计：24元</p>
		</div>
		<!-- 详情弹窗 -->
		<van-popup class="flex-column flex-center" v-model="detailPop" :closeable="true" :close-on-click-overlay="false" style="width: 90%;">
			<div v-if="detailPop" class="flex-column flex-center" style="width:95%;">
				<p style="line-height: 25px;border-bottom: 1px solid #CCCCCC;width: 100%;">午餐</p>
				<table style="width: 90%;margin-bottom: 30px;" border="1" cellpadding="0" cellspacing="0">
					<tr style="height: 50px;">
						<td>名称</td>
						<td>数量</td>
						<td>金额（元）</td>
					</tr>
					<tr v-for="(items,index) in detailList" :key="index">
						<td>{{items.name}}</td>
						<td>{{items.quantity}}</td>
						<td>{{items.amount}}</td>
					</tr>
					<tr style="background-color: #26A2FF;">
						<td>合计</td>
						<td>{{sumQuantity}}</td>
						<td>{{sumAmount}}</td>
					</tr>
				</table>

				<div style="text-align: left;width: 80%;">
					<p style="text-align: center;">送餐地址</p>
					<p>江门市白石大道东4号路3栋</p>
					<p style="font-size: ;">张三先生 12345678912</p>
				</div>
			</div>
		</van-popup>

		<!-- 弹出层&&选择器 时间 地点 类型 -->
		<van-popup v-model="picker1" position="bottom">
			<van-datetime-picker v-model="date" type="year-month" @cancel="picker1 = false" @confirm="timeConf" />
		</van-popup>
		<van-popup v-model="picker2" position="bottom">
			<van-picker :columns="placeList" show-toolbar @cancel="picker2 = false" @confirm="placeConf" />
		</van-popup>
		<van-popup v-model="picker3" position="bottom">
			<van-picker :columns="typeList" show-toolbar @cancel="picker3 = false" @confirm="typeConf" />
		</van-popup>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					place: '大饭堂',
					type: '就餐',
					date: new Date(),
					name: '午餐',
					amount: '-8',
					detail: [{
							name: '红烧牛肉',
							quantity: '1',
							amount: '5'
						},
						{
							name: '炒青菜',
							quantity: '1',
							amount: '3'
						}
					]
				}, {
					place: '大饭堂',
					type: '就餐',
					date: new Date(),
					name: '午餐',
					amount: '-8',
					detail: [{
							name: '红烧牛肉',
							quantity: '1',
							amount: '5'
						},
						{
							name: '炒青菜',
							quantity: '1',
							amount: '3'
						}
					]
				}, {
					place: '大饭堂',
					type: '就餐',
					date: new Date(),
					name: '午餐',
					amount: '-8',
					detail: []
				}, {
					place: '大饭堂',
					type: '就餐',
					date: new Date(),
					name: '午餐',
					amount: '-8',
					detail: [{
							name: '红烧牛肉',
							quantity: '1',
							amount: '5'
						},
						{
							name: '炒青菜',
							quantity: '1',
							amount: '3'
						}
					]
				}, {
					place: '大饭堂',
					type: '就餐',
					date: new Date(),
					name: '午餐',
					amount: '-8',
					detail: [{
							name: '红烧牛肉',
							quantity: '1',
							amount: '5'
						},
						{
							name: '炒青菜',
							quantity: '1',
							amount: '3'
						}
					]
				}],
				currentDate: new Date(),
				type: '类型',
				place: '消费地点',
				date: new Date(),
				typeList: ['早餐', '午餐', '晚餐', '早餐外卖', '预约洗车', '购物'],
				placeList: ['饭堂', '小卖部'],
				picker1: false,
				picker2: false,
				picker3: false,
				detailPop: false, //详情弹窗
				detailList: [{
					name: '',
					amount: '',
					quantity: ''
				}], //弹窗框详情内容
				sumQuantity: '2', //弹窗数量合计
				sumAmount: '8', //弹窗金额合计
			}
		},
		methods: {
			timePop() {
				this.picker1 = true;
			},
			placePop() {
				this.picker2 = true;
			},
			typePop() {
				this.picker3 = true;
			},
			timeConf(e) {
				this.currentDate = e;
				this.picker1 = false;
			},
			placeConf(e) {
				this.place = e;
				this.picker2 = false;
			},
			typeConf(e) {
				this.type = e;
				this.picker3 = false;
			},
			detail(e) {
				//赋值新数组用于页面循环
				this.detailList = e;
				//计算总数
				let sumQuantity = 0;
				let sumAmount = 0;
				for (let i = 0; i < this.detailList.length; i++) {
					sumQuantity = parseInt(this.detailList[i].quantity) + sumQuantity;
					sumAmount = parseInt(this.detailList[i].amount) + sumAmount;
				}
				// console.log(this.sumAmount, this.sumQuantity, this.list[e].detail);
				this.detailPop = true;
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
