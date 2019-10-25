<template>
	<!-- 线上订餐 -->
	<div>
		<div class="flex-row" style="align-items: center;justify-content: space-around;margin: 20px 0;">
			<van-button class="myBtn" @click="timeShow = true">{{currentDate}}
				<div class="mIcon" />
			</van-button>
			<p>订餐数量：8</p>
		</div>
		<table width="100%">
			<tr>
				<td>全选</td>
				<td>全早</td>
				<td>全午</td>
				<td>全晚</td>
			</tr>
			<tr>
				<td>日期</td>
				<td v-for="(item,index) in mealList" :key="index">{{item.name}}</td>
			</tr>
			<tr>

			</tr>
		</table>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				timeShow: false,
				currentDate: "2019-10",
				mealList: [{
						"id": 7,
						"c_id": 6,
						"name": "早餐",
						"type": "day",
						"create_time": "2019-07-30 02:07:17",
						"type_number": 10,
						"meal_time_begin": "07:00:00",
						"meal_time_end": "08:00:00",
						"limit_time": "09:00:00",
						"ordered_count": 1
					},
					{
						"id": 6,
						"c_id": 6,
						"name": "中餐",
						"type": "day",
						"create_time": "2019-07-30 02:07:17",
						"type_number": 10,
						"meal_time_begin": "12:00:00",
						"meal_time_end": "13:00:00",
						"limit_time": "10:00:00"
					},
					{
						"id": 7,
						"c_id": 6,
						"name": "晚餐",
						"type": "day",
						"create_time": "2019-07-30 11:24:36",
						"type_number": 10,
						"meal_time_begin": "18:00:00",
						"meal_time_end": "19:00:00",
						"limit_time": "10:00:00"
					}
				]
			}
		},
		methods: {

		}
	}
</script>

<style scoped>
</style>
