<template>
	<div>
		<van-cell-group class="a">
			<van-field label="发送范围:" clickable readonly :placeholder="getMap.size ==0? '选择部门或成员':'已选择'" right-icon="arrow"
			 @click="chooseRange"></van-field>
			<van-field v-model="content.content_title" label="标题:" />
			<van-field v-model="content.content_author" label="作者:" />
			<van-field v-model="content.content_content" placeholder="输入发布内容" autosize show-word-limit rows="5" type="textarea" />
			<van-field v-model="content.content_equity_title" label="权益标题:" />
			<van-field v-model="content.content_equity_url" label="链接:" placeholder="非必填" autosize type="textarea" rows="3" />
		</van-cell-group>
		<div style="position: fixed;width: 100%;bottom: 0;">
			<van-button type="info" size="large" @click="submit">完成</van-button>
		</div>
	</div>
</template>

<script>
	import {
		Toast
	} from 'vant';
	import {
		mapGetters
	} from 'vuex';
	import {
		addNotice
	} from '@/api/notice.js';
	export default {
		data() {
			return {
				content: {
					content_title: '',
					content_author: '',
					content_content: '',
					content_equity_url: '',
					content_equity_title: ''
				}
			}
		},
		methods: {
			async submit() {
				Toast.loading({
					message: "提交中...",
					forbidClick: true,
					duration: 0
				});
				let d_ids = [];
				let s_ids = [];
				this.getMap.forEach((value, key, m) => {
					d_ids.push(key);
					s_ids.push(value);
				});
				if (this.getMap.size == 0) {
					Toast.fail('请选择部门或者成员！');
				} else if (this.content.content_title == '' || this.content.content_author == '' || this.content.content_content ==
					'') {
					Toast.fail('请讲公告信息填写完整！')
				} else {
					const result = await addNotice({
						title: this.getAll.content_title,
						content: this.getAll.content_content,
						author: this.getAll.content_author,
						equity_url: this.getAll.content_equity_url,
						equity_title: this.getAll.content_equity_title,
						d_ids: d_ids.toString(),
						s_ids: s_ids.toString()
					});
					if (result.errorCode == 0) {
						Toast.success('发布成功！');
						this.$router.push({name:'notice'});
					}
				};
				Toast.clear();
			},
			chooseRange() {
				this.$router.push({
					name: 'selection',
				});
				//缓存页面信息
				console.log(this.content.content_content);
				this.$store.commit('notice/setAll', {
					content_title: this.content.content_title,
					content_content: this.content.content_content,
					content_author: this.content.content_author,
					content_equity_url: this.content.content_equity_url,
					content_equity_title: this.content.content_equity_title,
				});
			}
		},
		computed: {
			...mapGetters('notice', {
				getAll: 'getAll'
			}),
			...mapGetters('noticeid', {
				getMap: 'getMap'
			})
		},
		mounted() {
			this.content = this.getAll;
		}
	}
</script>

<style>
	.a {
		text-align: left;
	}
</style>
