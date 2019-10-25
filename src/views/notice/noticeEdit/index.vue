<template>
	<div>
		<van-cell-group class="a">
			<van-field label="发送范围:" clickable readonly placeholder="选择部门或成员" right-icon="arrow" @click="chooseRange"></van-field>
			<van-field v-model="title" label="标题:"></van-field>
			<van-field v-model="author" label="作者:"></van-field>
			<van-field v-model="content" placeholder="输入发布内容" autosize show-word-limit rows="10" type="textarea"></van-field>
			<van-field v-model="link" label="链接:" placeholder="非必填" autosize type="textarea" rows="3"></van-field>
		</van-cell-group>
		<div style="position: fixed;width: 100%;bottom: 0;" >
			<van-button type="info" size="large" @click="submit">完成</van-button>
		</div>
	</div>
</template>

<script>
	import{Toast} from 'vant';
	export default {
		data() {
			return {
				title: '',
				author: '',
				content: '',
				link: ''
			}
		},
		methods:{
			submit(){
				Toast.success("提交成功");
				//调用提交接口
				this.$router.push({name:'notice'});
			},
			chooseRange(){
				this.$router.push({name:'selection'});
			}
		}
	}
</script>

<style>
	.a {
		text-align: left;
	}
</style>
