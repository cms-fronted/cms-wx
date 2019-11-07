<template>
	<div>
		<!-- <h3 style="margin: 0;padding: 25px 0;font-size: 16px;color: #BCBCBC;background-color: rgba(242, 242, 242, 0.8);">你还没添加地址哦，请先添加收货地址</h3> -->
		<div class="flex-row address">
			<van-button style="position: fixed;left: 10px;" size="small" @click="bindToBack">取消</van-button>
			<h4 style="width: 100%; margin: 15px 0;">修改送餐地址</h4>
		</div>
		<van-address-edit :area-list="areaList" show-search-result area-columns-placeholder="['请选择', '请选择', '请选择']" @save="onSave"
		 :is-saving="isSaving" :address-info="addressInfo">
			<van-radio-group class="flex-row flex-center" style="justify-content: space-around;padding:10px 16px;" v-model="addressInfo.sex">
				<van-radio name="2">女士</van-radio>
				<van-radio name="1">先生</van-radio>
			</van-radio-group>
		</van-address-edit>
	</div>
</template>

<script>
	import {
		Toast
	} from 'vant';
	import {
		updateUserAddress
	} from '@/api/user.js';
	import area from '@/utils/area.js'
	export default {
		data() {
			return {
				areaList: area, //地区选择列表
				isSaving: false, //保存按钮加载动画
				addressInfo: {
					id: '',
					name: '',
					tel: '',
					province: '',
					city: '',
					county: '',
					addressDetail: '',
					areaCode: '',
					sex: '', //性别
				}, //选中地址
				shop: [],
				selfDish: [],
			}
		},
		methods: {
			/* 
			取消返回上一级
			 */
			bindToBack() {
				if (this.shop.products.length > 0) {
					this.$router.push({
						name: 'placeorder',
						params: this.shop
					});
				} else if (this.selfDish.detail.length > 0) {
					this.$router.push({
						name: 'placeorder',
						params: this.selfDish
					});
				};
			},
			/*
			 保存修改地址
			 */
			async onSave(content) {
				console.log(content);
				this.isSaving = true;
				const data = {
					"id": this.addressInfo.id,
					"province": content.province,
					"city": content.city,
					"area": content.county,
					"address": content.addressDetail,
					"name": content.name,
					"phone": content.tel,
					"sex": this.addressInfo.sex
				};
				/* 
				调用修改地址接口
				 */
				const result = await updateUserAddress(data);
				console.log(result);
				if (result.errorCode == 0) {
					if (this.shop.products.length > 0) {
						this.$router.push({
							name: 'placeorder',
							params: this.shop
						});
					} else if (this.selfDish.detail.length > 0) {
						this.$router.push({
							name: 'placeorder',
							params: this.selfDish
						});
					};
				};
				this.isSaving = false;
			}
		},
		created() {
			const det = this.$route.params.data;
			const data = this.$route.params;
			if (data.shop) {
				this.shop = data.shop;
			} else if (data.selfDish) {
				this.selfDish = data.selfDish
			};
			console.log('编辑页面获取值：', det);
			//遍历出地区编码
			Object.keys(area.county_list).forEach((key) => {
				if (area.county_list[key] == det.area) {
					this.addressInfo.areaCode = key;
				};
			});
			//初始化页面的值
			this.addressInfo = Object.assign(this.addressInfo, {
				id: det.id,
				name: det.name,
				tel: det.phone,
				province: det.province,
				city: det.city,
				county: det.area,
				addressDetail: det.address,
				sex: det.sex.toString()
			});
		}
	}
</script>

<style scoped>
	.address {
		text-align: center;
		align-items: center;
		border-bottom: 1px solid #F2F3F5;
	}
</style>
