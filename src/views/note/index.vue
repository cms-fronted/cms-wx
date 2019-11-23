<template>
	<div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<div class="content" v-for="(item,index) in note" :key="index">
				<p style="font-weight: 700;font-size: 16px;">{{item.title}}</p>
				<p style="color: #A1A1A1;">{{item.create_time}}</p>
				<p>{{item.content}}</p>
				<a :href="item.equity_url">{{item.equity_title}}>></a>
			</div>
		</van-list>
	</div>
</template>

<script>
	import {
		getUserNotice
	} from '@/api/notice.js';
	import {
		Toast
	} from 'vant';

	export default {
		data() {
			return {
				total: 0,
				per_page: 10,
				current_page: 1,
				last_page: 0,
				loading: false,
				finished: false,
				note: [] //通知列表
			}
		},
		methods: {
			async onLoad() {
				console.log(this.current_page, this.last_page);
				if (this.last_page != null && this.last_page != 0) {//非初始值且最后一页不为0
					if (this.current_page >= this.last_page) {
						//加载完成
						this.finished = true;
					} else {
						this.current_page += 1;
						const result = await getUserNotice({
							page: this.current_page,
							size: this.per_page
						});
						if (result.errorCode == 0) {
							this.toatal = result.data.total;
							this.last_page = result.data.last_page;
							this.note = this.note.concat(result.data.data);
						}
					}
				} else if(this.total == 0 && this.last_page!=null) {//非初始值且总数为0 没有更多
					this.finished = true;
				}else{
					this.finished = false;
				}
				this.loading = false;
			}
		},
		async created() {
			Toast.loading({
				message: '加载中...',
				forbidClick: true,
				duration: 0
			})
			const result = await getUserNotice({
				page: this.current_page,
				size: this.per_page
			});
			if (result.errorCode == 0) {
				this.toatal = result.data.total,
					this.last_page = result.data.last_page
				this.note = result.data.data;
			}
			Toast.clear();
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
