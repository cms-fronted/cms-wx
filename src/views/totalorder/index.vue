<template>
	<!-- 总订餐查询 -->
	<div id="totalorder">
		<!-- 选择器 -->
		<div class="flex-row picker shadow">
			<van-button class="btn" type="default" @click="show = true">{{$moment(date).format('YYYY-MM-DD')}}
				<van-icon name="arrow-down" />
			</van-button>
			<van-button class="btn" type="default" @click="pickerEvent2">{{place}}
				<van-icon name="arrow-down" />
			</van-button>
		</div>
		<!-- 订餐内容 -->
		<div class="content shadow" v-for="(items,index) in mealTimes" :key="index">
			<p style="text-align: left;line-height: 2px;font-size: 20px;margin-left: 5%;">{{items.title}}</p>
			<div class="flex-row">
				<ul v-for="(item,key) in items.data" :key="key">
					<li class="flex-column flex-center">
						<p>{{item.name}}</p>
						<p>{{item.total}}</p>
					</li>
				</ul>
			</div>
		</div>

		<!-- 弹出层&时间选择器 -->
		<van-popup v-model="show" position="bottom" style="width: 100%" :style="{ height: '40%' }">
			<van-datetime-picker v-model="currentDate" @cancel="show = false" type="date" @confirm="timeEvent" />
		</van-popup>
		<!-- 弹出层&饭堂选择器 -->
		<van-popup v-model="show1" position="bottom" style="width: 100%">
			<van-picker show-toolbar :columns="placeList" @cancel="show1 = false" @confirm="placeEvent" />
		</van-popup>
		<!-- 弹出层&菜品 -->
		<van-popup class="van-popup" v-model="detail" closeable>
			<p class="popTitle">订餐数量</p>
			<div class="mealAmount">
				<table border="0" cellspacing="0" cellpadding="0">
					<tr style="line-height:30px;">
						<td style="width: 70%;">名称</td>
						<td style="width: 30%;">订餐人数</td>
					</tr>
					<tr style="line-height: 30px;" v-for="(item,index) in menuDetail" :key="index">
						<td>{{item.foodName}}</td>
						<td @click="detail">{{item.total}}</td>
					</tr>
				</table>
			</div>
		</van-popup>
		<!-- 弹出器&&人员明细 -->
		<van-popup class="van-popup" v-model="personDetail" closeable>
			<p class="popTitle">订餐人员明细</p>
			<div class="mealAmount">
				<table border="0" cellspacing="0" cellpadding="0">
					<tr style="line-height:30px;">
						<td style="width: 30%;">名称</td>
						<td style="width: 70%;">手机号码</td>
					</tr>
					<tr style="line-height: 30px;" v-for="(item,index) in personList" :key="index">
						<td>{{item.name}}</td>
						<td>{{item.phone}}</td>
					</tr>
				</table>
			</div>
		</van-popup>

	</div>
</template>

<script>
	import moment from 'moment'
	import {
		Dialog
	} from 'vant'

	export default {
		name: 'totalorder',
		data() {
			return {
				detail: false, //popup 订餐人数显示
				personDetail: true, //popup 人员明细
				show: false,
				show1: false,
				date: new Date(), //选择器时间
				place: '大饭堂',
				currentDate: new Date(),
				placeList: ['大饭堂', '小饭堂', '小卖部'],
				mealTimes: [{
					title: '早餐',
					data: [{
						name: '订餐数量',
						total: '12'
					}, {
						name: '已就餐数量',
						total: '12'
					}, {
						name: '未订餐就餐数量',
						total: '12'
					}, {
						name: '订餐未就餐数量',
						total: '12'
					}]
				}, {
					title: '午餐',
					data: [{
						name: '订餐数量',
						total: '12'
					}, {
						name: '已就餐数量',
						total: '12'
					}, {
						name: '未订餐就餐数量',
						total: '12'
					}, {
						name: '订餐未就餐数量',
						total: '12'
					}]
				}, {
					title: '晚餐',
					data: [{
						name: '订餐数量',
						total: '12'
					}, {
						name: '已就餐数量',
						total: '12'
					}, {
						name: '未订餐就餐数量',
						total: '12'
					}, {
						name: '订餐未就餐数量',
						total: '12'
					}]
				}],
				menuDetail: [{
					foodName: '炒牛肉',
					total: '3'
				}, {
					foodName: '炒牛肉',
					total: '3'
				}, {
					foodName: '炒牛肉',
					total: '3'
				}],
				personList: [{
					name: '张三',
					phone: '12345678912'
				}]
			}
		},
		methods: {
			pickerEvent2() {
				this.show1 = true
			},
			timeEvent(e) {
				this.date = e
				this.show = false
			},
			placeEvent(e) {
				this.place = e
				this.show1 = false
			},
		},
		created() {
			Dialog.alert({
				message: '就餐时间未结束，不能进行一键扣费操作，请在13:30（消费策略时间）后进行操作'
			})
		}
	}
</script>

<style lang="scss" scoped>
	#totalorder {
		width: 100%;
	}

	.van-popup {
		width: 90%;
	}

	#totalorder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.content {
		width: 95%;
		display: flex;
		flex-direction: column;
		margin-top: 30px;
	}

	.shadow div {
		width: 100%;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.shadow ul {
		justify-content: space-around;
		width: 45%;
		box-shadow: 5px 5px 10px 0px #ccc;
		border-radius: 5px;
		margin-bottom: 20px;
	}

	.shadow ul li {
		height: 80px;
		line-height: 0px;
		height: 70px;
		font-size: 16px;
	}

	.shadow ul li:active {
		box-shadow: 0px 0px 10px #ccc;
	}

	.picker {
		justify-content: space-around;
		align-items: center;
		width: 100%;
		height: 70px;
	}

	.mealAmount {
		width: 100%;
		height: 300px;
		overflow: scroll;
	}

	.mealAmount td {
		border-left: 1px solid #C8C9CC;
		border-top: 1px solid #C8C9CC;
	}

	.mealAmount table {
		width: 90%;
		margin: 0 5%;
		text-align: center;
		border-right: 1px solid #C8C9CC;
		border-bottom: 1px solid #C8C9CC;
	}

	.popTitle {
		font-size: 24px;
		line-height: 10px;
	}

	.btn {
		border-radius: 10px;
	}
</style>
