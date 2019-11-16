<template>
	<div id="ecard">
		<img :src="img_url" />
		<span>生成日期：{{sTime}}</span>
		<span style="margin-bottom:120px;">失效日期：{{eTime}}</span>
	</div>
</template>

<script>
	import {
		getCard
	} from '@/api/user.js';
	import {Toast} from 'vant';
	
	export default {
		name: "Ecard",
		data() {
			return {
				sTime: '',
				eTime: '',
				img_url: ''
			}
		},
		/* 
		初始化 数据
		 */
		async created() {
			Toast.loading({
				forbidClick:true,
				duration:0
			});
			//获取电子饭卡
			const result = await getCard();
			if (result.errorCode == 0) {
				this.img_url = result.data.url;
				this.sTime = result.data.create_time;
				this.eTime = result.data.expiry_date;
			};
			Toast.clear();
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

	#ecard span {
		margin-top: 20px;
	}
</style>
