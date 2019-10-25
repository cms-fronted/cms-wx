<template>
	<div>
		<div class="content" v-for="(item,index) in note" :key="index">
			<p style="font-weight: 700;font-size: 16px;">{{item.title}}</p>
			<p style="color: #A1A1A1;">{{item.create_time}}</p>
			<p>{{item.content}}</p>
			<a :href="item.equity_url">{{item.equity_title}}>></a>
		</div>
	</div>
</template>

<script>
	export default {

		data() {
			return {
				total: 1,
				per_page: 10,
				current_page: 1,
				last_page: 1,
				note: [{
					"id": 1,
					"s_id": 9,
					"read": 2,
					"title": "国庆放假通知",
					"content": "国庆放假七天!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!sfasdfasdfasdfsadfadf",
					"equity_url": "http:// a.ccom", //权益跳转地址
					"equity_title": "国庆优惠", //权益标题
					"create_time": "2019-09-17 16:43:05",
					"author": "里斯",
					"type": "公告"
				}]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		line-height: 16px;
		text-align: left;
		font-size: 14px;
		/* 		width: 95%; */
		/* margin: auto; */
		border: 1px solid #CCCCCC;
		margin: 20px 10px 0 10px;
		padding: 10px;
	}

	.content p {
		margin: 10px 0;
	}
</style>
