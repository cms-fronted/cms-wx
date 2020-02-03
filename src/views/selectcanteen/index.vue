<template>
	<!-- 选择企业 -->
	<div>
		<div class="flex-row" style="align-items: flex-end;justify-content: space-between;margin-top: 20px;padding: 0 10px;">
			<p>我的企业</p>
			<van-search style="width: 170px;" placeholder="搜索企业" v-model="value" shape="round" />
		</div>
		<van-collapse v-model="activeNames">
			<van-collapse-item icon="shop-o" :title="items.company.name" :name="index" v-for="(items,index) in list" :key="index">
				<van-cell v-for="(item,key) in items.canteens" :key="key" @click.stop="seleCanteen(item.canteen_id)">
					{{item.info.name}}
				</van-cell>
			</van-collapse-item>
		</van-collapse>
	</div>
</template>

<script>
	import {
		bindCanteen,
		canChooseCant
	} from '@/api/user.js'
	import {
		mapGetters
	} from 'vuex'
	import {
		Toast
	} from 'vant'
	export default {
		data() {
			return {
				value: '',
				activeNames: ['1'],
				list: []
			}
		},
		methods: {
			async seleCanteen(e) {
				//调用用户选择进入饭堂接口
				const result = await bindCanteen({
					"canteen_id": e
				});
				if (result.errorCode == 0) {
					Toast.success('选择成功！');
					//存储用户选择饭堂
					this.$store.commit('user/setCanteen', e);
					setTimeout(()=>{
						this.$router.push('/');
					}, 1000);
				}
			}
		},
		computed: {
			...mapGetters('user', {
				canteen_id: 'canteenIdGetters'
			})
		},
		async created() {
			//获取用户可选饭堂
			const result = await canChooseCant();
			this.list = result.data;
		}
	}
</script>

<style scope>

	.van-collapse-item__content {
		padding: 0 !important;
	}
</style>
