<template>
	<div id="ecard">
		<img :src="img_url" />
		<span>生成日期：{{sTime}}</span>
		<span>失效日期：{{eTime}}</span>
	</div>
</template>

<script>
	import {getCard} from '@/api/user.js';
	export default {
		name: "Ecard",
		data() {
			return {
				sTime: '2019/5/10 16:20:50',
				eTime: '2019/5/10 16:30:50',
				img_url:''
			}
		},
		/* 
		初始化 数据
		 */
		async created(){
			//获取电子饭卡
			const result = await getCard();
			if(result.errorCode == 0){
				this.img_url = result.data.url;
			}
		}
	}
</script>

<style scoped>
	#ecard {
		width: 100%;
		height: 100%;
		display: flex;
		position: fixed;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	#ecard img {
		width: 60%;
		margin-bottom: 20px;
	}
	#ecard span{
		margin-top: 20px;
	}
</style>
