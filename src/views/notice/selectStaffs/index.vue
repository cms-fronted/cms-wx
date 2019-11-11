<template>
	<!-- 人员选择 -->
	<div>
		<form action="/">
			<van-search v-model="value" placeholder="请输入搜索关键词" show-action @search="onSearch" @cancel="onCancel" />
		</form>
		<van-cell-group style="textl-align:left">
			<van-cell :value="'选择发布范围>'+department_name" />
		</van-cell-group>
		<van-checkbox-group v-model="result" ref="checkboxGroup">
			<van-cell-group>
				<van-cell v-for="(item, index) in list" clickable :key="index" :title="item.username" @click="toggle(index)">
					<van-checkbox :name="item.id" ref="checkboxes" slot="right-icon" />
				</van-cell>
			</van-cell-group>
		</van-checkbox-group>
		<div style="position: fixed;width: 100%;bottom: 0;">
			<van-button type="info" size="large" @click="submit">确定</van-button>
		</div>
	</div>
</template>

<script>
	import {
		getStaffs
	} from '@/api/notice.js';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				result: [],
				list: [],
				value: '',
				department_id: null,
				department_name: null,
				data: [] // data:[{d_ids:[s_id,s_id,s_id...]}],
			}
		},
		methods: {
			onSearch() {

			},
			onCancel() {

			},
			toggle(index) {
				this.$refs.checkboxes[index].toggle();
			},
			//确认
			submit() {
				/* 设置缓存 */
				var data = {
					d_ids: this.department_id,
					list: this.result
				};
				this.$store.commit('noticeid/setSId', data);
				this.$router.push({
					name: 'selection',
				});
			}
		},
		async created() {
			this.department_id = this.$route.params.id;
			this.department_name = this.$route.params.name;
			//获取当前部门人员
			const result = await getStaffs({
				department_id: this.department_id
			});
			if (result.errorCode == 0) {
				this.list = result.data;
			}
			//新
			var data = this.getMap;
			var list = new Array();
			data.forEach((value, key, m)=>{
				if (key == this.department_id) {
					list = value;
				};
			});
			this.result = list;

			//格式化data属性

		},
		computed: {
			...mapGetters('noticeid', {
				getMap: 'getMap'
			})
		}
	}
</script>

<style>
</style>
