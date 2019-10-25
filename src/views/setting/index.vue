<template>
	<div>
		<p style="text-align: left;font-size: 13px;padding: 0 20px;">切换企业</p>
		<van-radio-group v-model="radio">
			<van-cell-group>
				<van-cell title-style="text-align:left;" icon="home-o" v-for="(item,index) in list" :key="index" :title="item.company" clickable @click="radio = item.id">
					<van-radio slot="right-icon" :name="item.id" />
				</van-cell>
			</van-cell-group>
		</van-radio-group>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				radio: null,
				list: [{
					"id": 9,
					"company_id": 2,
					"company": "一企业"
				}, {
					"id": 10,
					"company_id": 2,
					"company": "二企业"
				}, {
					"id": 11,
					"company_id": 2,
					"company": "三企业"
				}, {
					"id": 12,
					"company_id": 2,
					"company": "四企业"
				}, {
					"id": 13,
					"company_id": 2,
					"company": "五企业"
				}]
			}
		}
	}
</script>

<style>
</style>
