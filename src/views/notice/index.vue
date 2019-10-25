<template>
	<!-- 公告发布 -->
	<div class="flex-column felx-center" style="padding-bottom: 50px;">
		<!-- 公告内容 -->
		<div v-for="(item,index) in list" :key="index" style="border-bottom: 3px solid #CCCCCC;">
			<van-cell-group>
				<van-field style="padding: 5px 16px;" label-width="40px" v-model="item.title" label="标题" size="small"></van-field>
				<van-field label-width="40px" v-model="item.content" rows="5" autosize label="内容" readonly type="textarea" />
				<div class="mAuthor">
					<p>{{item.create_time}}</p>
					<p>{{item.author}}</p>
				</div>
			</van-cell-group>
		</div>
		<van-divider :style="{ color: '#CCCCCC', borderColor: '#CCCCCC', padding: '0 16px' }">
		  没有更多了
		</van-divider>
		<!-- 发布新公告 -->
		<van-button style="position: fixed; bottom: 0;width: 100%;" icon="edit" type="info" size="large" to="/noticeEdit">
			发公告
		</van-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				"total": 1,
				"per_page": 10,
				"current_page": 1,
				"last_page": 1,
				list: [{
					"id": 1,
					"title": "国庆放假通知",
					"content": "国庆放假七天",
					"author": "里斯",
					"create_time": "2019-9-25" //(返回参数说明) {int} total 数据总数
				}, {
					"id": 1,
					"title": "国庆放假通知",
					"content": "国庆放假七天",
					"author": "里斯",
					"create_time": " " //(返回参数说明) {int} total 数据总数
				}, {
					"id": 1,
					"title": "国庆放假通知",
					"content": "国庆放假七天",
					"author": "里斯",
					"create_time": " " //(返回参数说明) {int} total 数据总数
				}, {
					"id": 1,
					"title": "国庆放假通知",
					"content": "国庆放假七天",
					"author": "里斯",
					"create_time": " " //(返回参数说明) {int} total 数据总数
				}, {
					"id": 1,
					"title": "国庆放假通知",
					"content": "国庆放假七天",
					"author": "里斯",
					"create_time": " " //(返回参数说明) {int} total 数据总数
				}]
			}
		}
	}
</script>

<style scoped>
	.mAuthor{
		display: flex !important;
		flex-direction: row !important ;
	}

	.mAuthor p {
		margin: 0 10px;
		font-size: 12px;
		color: #C8C9CC;
	}
</style>
