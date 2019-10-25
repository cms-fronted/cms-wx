<template>
	<div>
		<form action="/">
			<van-search v-model="value" placeholder="请输入搜索关键词" show-action @search="onSearch" @cancel="onCancel" />
		</form>
		<van-cell-group style="textl-align:left">
			<van-cell title="选择发布范围" value="全选" @click="selectAll" />
		</van-cell-group>
		<van-checkbox-group v-model="result">
			<van-collapse v-model="activeNames">
				<van-collapse-item v-for="(item,index) in list" :key="index" :title="item.department" :name="index">
					<van-checkbox :name="item" ref="checkboxes" slot="right-icon" @click.stop="chooseDep" />
					<van-checkbox-group v-model="result">
						<van-cell-group>
							<van-cell v-for="(items, key) in item.starf" clickable :key="key" :title="items" @click="stoggle(key)">
								<van-checkbox :name="items" ref="scheckboxes" slot="right-icon" />
							</van-cell>
						</van-cell-group>
					</van-checkbox-group>
				</van-collapse-item>
			</van-collapse>
		</van-checkbox-group>
		<div style="position: fixed;bottom: 0;width: 100%;">
			<van-button type="info" size="large" @click="submit">确定</van-button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				list: [{
					department: 'A部门',
					starf: ['张三', '李四', '王五']
				}, {
					department: 'B部门',
					starf: ['李白', '杜甫', '王维']
				}, {
					department: 'C部门',
					starf: ['王昭君', '孙尚香', '李云龙']
				}, {
					department: 'D部门',
					starf: ['西施', '嫦娥', '孙悟空']
				}],
				activeNames: [],
				result: []
			}
		},
		methods: {
			onSearch() {
				//调用查询方法
			},
			onCancel() {
				this.value = '';
			},
			selectAll() {
			
			},
			toggle(index) {
				this.$refs.checkboxes[index].toggle();
			},
			stoggle(index) {
				this.$refs.scheckboxes[index].toggle();
			},
			chooseDep(){
				console.log('123');
			},
			submit(){
				this.$router.go(-1);
			}
		}
	}
</script>

<style>
</style>
