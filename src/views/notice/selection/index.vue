<template>
	<!-- 选择部门 -->
	<div>
		<form action="/">
			<van-search v-model="value" placeholder="请输入搜索关键词" show-action @search="onSearch" @cancel="onCancel" />
		</form>
		<van-cell-group style="textl-align:left">
			<van-cell title="选择发布范围" value="全选" />
		</van-cell-group>
		<van-checkbox-group v-model="result">
			<van-cell-group>
				<van-cell v-for="(item, index) in list" clickable :key="index" :title="item.name" @click="bindToStaffs(item)">
					<van-checkbox :name="item.id" ref="checkboxes" @click.stop="ccc()" slot="right-icon" />
				</van-cell>
			</van-cell-group>
		</van-checkbox-group>
		<div style="position: fixed;bottom: 0;width: 100%;">
			<van-button type="info" size="large" @click="submit">确定</van-button>
		</div>
	</div>
</template>

<script>
	import {
		getDepartment
	} from '@/api/notice.js';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				value: '',
				list: [],
				activeNames: [],
				result: [],
				content: null,
			}
		},
		methods: {
			onSearch() {
				//调用查询方法
			},
			onCancel() {
				this.value = '';
			},
			ccc(e) {},
			chooseDep() {
				console.log('123');
			},
			submit() {
				this.$store.commit('noticeid/setDId', this.result);
				this.$router.push({
					name: 'noticeEdit'
				});
			},
			bindToStaffs(e) {
				//缓存当前页面所选部门id
				this.$store.commit('noticeid/setDId', this.result);
				this.$router.push({
					name: 'selectStaffs',
					params: {
						name: e.name,
						id: e.id
					}
				});
			}
		},
		async created() {
			//获取部门列表
			const result = await getDepartment();
			if (result.errorCode == 0) {
				this.list = result.data;
			};
		},
		computed: {
			...mapGetters('noticeid', {
				getMap: 'getMap'
			})
		},
		mounted() {
			let data = [];
			if (this.getMap.size != 0) {
				this.getMap.forEach(function(value, key, m) {
					if (value.length == 0) {
						data.push(key);
					};
				});
			};
			this.result = data;
		}
	}
</script>

<style>
</style>
