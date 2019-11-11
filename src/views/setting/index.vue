<template>
	<div>
		<p style="text-align: left;font-size: 13px;padding: 0 20px;">企业选择</p>
		<van-radio-group v-model="radio">
			<van-cell-group v-for="(items,index) in list" :key="index">
				<van-cell title-style="text-align:left;" icon="home-o" :title="items.company.name" clickable @click="radio = items.id">
					<!-- <van-radio slot="right-icon" :name="items.id" /> -->
				</van-cell>
				<div style="padding-left: 50px;width: auto;text-align: left;" v-for="(item,key) in items.canteens" :key="key">
					<van-cell :title="item.info.name" style="border-bottom: 0.5px solid #F2F3F5;" clickable @click="choiceCanteen(item)">
						<van-icon v-if="item.check" name="passed" color="#26A2FF" />
					</van-cell>
				</div>
			</van-cell-group>
		</van-radio-group>
	</div>
</template>

<script>
	import {
		canChooseCant,
		bindCanteen
	} from '@/api/user.js';
	import {
		mapGetters
	} from 'vuex';
	import {
		Toast
	} from 'vant';

	export default {
		data() {
			return {
				radio: null,
				list: []
			}
		},
		async created() {
			Toast.loading({
				forbidClick: true,
				duration: 0
			})
			const result = await canChooseCant();
			if (result.errorCode == 0) {
				this.list = result.data;
				this.list.forEach((items, index) => {
					items.canteens.forEach((item, key) => {
						if (item.info.id == this.canteen_id) {
							this.list[index].canteens[key] = Object.assign(this.list[index].canteens[key], {
								check: true
							});
						}
					});
				});
			};
			Toast.clear();
		},
		methods: {
			choiceCanteen(e) {
				this.$dialog.confirm({
					message: '是否选择' + e.info.name + '?'
				}).then(() => {
					Toast.loading({
						forbidClick: true,
						duration: 0
					})
					bindCanteen({
						canteen_id: e.canteen_id
					}).then((result) => {
						console.log(result);
						if (result.errorCode == 0) {
							Toast.success('选择成功！');
							this.$store.commit('user/setCanteen', e.canteen_id)
							this.$router.push({
								path: '/'
							});
						};
					});
					Toast.clear();
				});
			},
		},
		computed: { ...mapGetters('user', {
				canteen_id: 'canteenIdGetters'
			}),
		}
	}
</script>

<style>
	. {
		color: #26A2FF;
	}
</style>
