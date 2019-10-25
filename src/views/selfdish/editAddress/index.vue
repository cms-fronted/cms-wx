<template>
	<div>
		<!-- <h3 style="margin: 0;padding: 25px 0;font-size: 16px;color: #BCBCBC;background-color: rgba(242, 242, 242, 0.8);">你还没添加地址哦，请先添加收货地址</h3> -->
		<div class="flex-row address">
			<van-button style="position: fixed;left: 10px;" size="small" @click="bindToBack">取消</van-button>
			<h4 style="width: 100%; margin: 15px 0;">修改送餐地址</h4>
		</div>
		<van-address-edit :area-list="areaList" show-search-result area-columns-placeholder="['请选择', '请选择', '请选择']" @save="onSave"
		 :is-saving="isSaving" :address-info="addressInfo">
			<van-radio-group class="flex-row flex-center" style="justify-content: space-around;padding:10px 16px;" v-model="sex">
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
		addUserAddress
	} from '@/api/user.js';
	import area from '@/utils/area.js'
	export default {
		data() {
			return {
				sex: '', //性别
				areaList: area, //地区选择列表
				isSaving: false, //保存按钮加载动画
				addressInfo: {
					id: '',
					name: '',
					tel: '',
					province: '',
					city: '',
					county: '',
					addressDetail: ''
				} //选中地址
			}
		},
		methods: {
			//取消返回上一级
			bindToBack() {
				this.$router.go(-1);
			},
			async onSave(content) {
				if (this.sex == '') {
					Toast('请选择性别');
				} else {
					this.isSaving = true;
					const data = {
						"province": content.province,
						"city": content.city,
						"area": content.county,
						"address": content.addressDetail,
						"name": content.name,
						"phone": content.tel,
						"sex": this.sex
					}
					const result = await updateUserAddress(data);
					if (result.errorCode == 0) {
						this.$router.go(-1);
					}
				}
			}
		},
		created() {
			console.log('页面传值接收：', this.$route.params.detail);
			// this.addressInfo = this.$route.params.detail;
			// addressInfo:{
			// 	id:'',
			// 	name:'',
			// 	tel:'',
			// 	province:'',
			// 	city:'',
			// 	county:'',
			// 	addressDetail:''
			// }//选中地址
			console.log(area.county_list);
			const det = this.$route.params.detail;
			this.addressInfo = {
				id: det.id,
				name: det.name,
				tel: det.phone,
				province: det.province,
				city: det.city,
				county: det.area,
				addressDetail: det.address,
				areaCode:'130983',
			};
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
