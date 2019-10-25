<template>
	<div id="ecard">
		<img src="../../assets/code.png" />
		<span>生成日期：{{sTime}}</span>
		<span>失效日期：{{eTime}}</span>
	</div>
</template>

<script>
	export default {
		name: "Ecard",
		data() {
			return {
				sTime: '2019/5/10 16:20:50',
				eTime: '2019/5/10 16:30:50'
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
