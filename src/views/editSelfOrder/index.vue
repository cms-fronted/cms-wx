<template>

	<div class="flex-column">
		<div class="flex-row" style="padding: 10px 20px 0 20px;">
			中餐
		</div>
		<!-- 订餐数量 -->
		<div class="flex-row" style="justify-content: space-around;align-items: center;padding: 10px 20px 0 20px;">
			<div class="flex-row" style="align-items: center;">
				<p>订餐数量</p>
				<input style="margin: 0 10px; width: 30%;height: 33px; border: 1px solid #ebedf0;border-radius: 10px;
				text-align: center;"
				 type="number" @blur="changeCount" ref="countInput" :value="count" />
			</div>
			<van-button style="width: 35%;border-radius: 10px;" type="info" @click="submitOrder">提交</van-button>
		</div>
		<!-- 就餐类型 -->
		<div class="flex-row" style="justify-content: space-between;align-items:centerfont-size: 15px;color: #EE0A24;padding: 10px 20px 0 20px;"
		 ref="mealType">
			<p style="">数量：{{dishCount}}</p>
			<p style="">金额：{{amount}}元</p>
		</div>
		<!-- 日期选择 -->
		<div class="dateMenu">
			<van-tabs color="#1989fa">
				<van-tab :title="$moment(date).format('MM-DD')">
				</van-tab>
			</van-tabs>
		</div>
		<!-- 菜品及数量选择 -->
		<div class="flex-row" :style="'height:'+scrollH+'px'" style="overflow: hidden;">
			<!-- 左边随动菜单栏 -->
			<div class="category" ref="category">
				<ul>
					<li v-for="(item,index) in list" :class="{active:currentIndex === index}" :key="index" @click="selectLeft(index)"
					 ref="lItem">{{item.category}}</li>
				</ul>
			</div>
			<!-- 右边菜品详情 -->
			<div class="footList" ref="footList">
				<ul>
					<li v-for="(items,index) in list" :key="index" ref="rItem">
						{{items.category}}
						<div class="flex-row footDetail" style v-for="(item,key) in items.foods" :key="key">
							<van-image fix="contain" width="45%" :src="'http://canteen.tonglingok.com/'+item.img_url" />
							<div class="flex-column" style="justify-content: center;width: 55%">
								<div class="flex-row" style="justify-content: space-between;align-items: center;">
									<p>{{item.name}}</p>
									<van-icon name="smile-o" size="25px" @click="openComment(item)" />
								</div>
								<p v-if="fixed != 1">￥：{{item.price}}</p>
								<van-stepper v-model="item.count" min="0" button-size="40px" :show-plus="!outLimited[index]||fixed==1" />
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import Bscroll from 'better-scroll';
	import {
		bindCanteen,
		getChooseDinner
	} from '@/api/user.js';
	import {
		getFoodList,
		changeFoods,
		getDinnerInfo
	} from '@/api/selfDish.js';
	import {
		Toast
	} from 'vant';
	import {
		mapGetters
	} from 'vuex';

	export default {
		data() {
			return {
				count: 1,
				list: [],
				scrollH: '',
				scrollY: 0, //获取实时滚动位置
				heightList: [], //获取每一个li的高度
				fixed: '',
				map: new Map(),
				copyList: [],
				date: '',
			}
		},
		methods: {
			/*
			 订餐数量选择
			 */
			changeCount(e) {
				this.count = this.$refs.countInput.value;
			},
			/* 修改提交 */
			async submitOrder() {
				//修改数据
				var products = []
				this.list.forEach((items, index) => {
					items.foods.forEach((item, key) => {
						if (item.count > 0) {
							products = products.concat(item);
						}
					});
				});

				//对比数据
				var add = [];
				var update = [];
				var cancel = [];
				console.log('1', this.$route.params.orderDetail.foods, '2', products);
				this.$route.params.orderDetail.foods.forEach((items, index) => {
					var isExist = false;
					products.forEach((item, key) => {
						if (items.food_id == item.food_id && items.count != item.count) {
							isExist = true;
						} else if (items.food_id == item.food_id) {
							isExist = true
						}
					});
					//delete
					if (!isExist) {
						cancel.push({
							menu_id: items.menu_id,
							cancel_foods: items.detail_id
						});
					}
				});
				products.forEach((items, index) => {
					var isExist = false;
					this.$route.params.orderDetail.foods.forEach((item, key) => {
						if (items.food_id == item.food_id && items.count != item.count) {
							isExist = true;
							//update
							update.push({
								menu_id: items.m_id,
								update_foods: [{
									detail_id: item.detail_id,
									count: items.count
								}]
							});
						} else if (items.food_id == item.food_id) {
							isExist = true;
						}
					});
					//add
					if (!isExist) {
						add.push({
							menu_id: items.m_id,
							add_foods: items
						});
					}
				});
				// 删除原本存在的对象
				console.log('product:', products);
				this.$route.params.orderDetail.foods.forEach((items, index) => {
					add.forEach((item, key) => {
						if (items.food_id == item.add_foods.food_id && items.count <= item.add_foods.count) {
							add.splice(key, 1);
						};
					});
				});
				// console.log('新增：', add);
				// 添加商品 add_foods => add
				console.log('更新：', update);
				console.log('取消：', cancel);
				// console.log(add);
				console.log('新增：', this.initArry(add));

				var list = new Array();

				var detail = list.concat(cancel, this.initArry(add), update);
				// detail.push(update,cancel,this.initArry(add));
				console.log(detail);
				var b = [];
				for (var i = 0; i < detail.length; i++) {
					for (var j = detail.length - 1; j > i; j--) {
						if (detail[i].menu_id == detail[j].menu_id) {
							detail[i] = Object.assign(detail[i], detail[j])
							console.log('=====', detail[i]);
							b.push(j)
						};
					};
				};
				for (var k = 0; k < b.length; k++) {
					detail.splice(b[k], 1);
				}
				console.log(detail);
				detail.forEach((item, index) => {
					console.log(item);
					if (!item.add_foods) {
						detail[index] = Object.assign(item, {
							add_foods: []
						})
					}
					if (!item.cancel_foods) {
						detail[index] = Object.assign(item, {
							cancel_foods: []
						})
					}
					if (!item.update_foods) {
						detail[index] = Object.assign(item, {
							update_foods: []
						})
					}
					detail[index].cancel_foods = item.cancel_foods.toString();
				})

				const result = await changeFoods({
					"id": this.$route.params.orderDetail.id,
					"count": this.count,
					"detail": JSON.stringify(detail)
				});
				console.log(result);
				if (result.errorCode == 0) {
					Toast.success('修改成功！');
					this.$router.push({
						path: '/'
					});
				}
			},
			initArry(list) {
				var arr = new Array();
				var isInsert = false;
				list.forEach(items => {
					if (arr.length > 0) {
						arr.forEach((item, key) => {
							if (item.menu_id == items.menu_id) {
								arr[key].add_foods.push(items.add_foods);
								isInsert = true;
							}
						});
						if (!isInsert) {
							arr.push({
								menu_id: items.menu_id,
								add_foods: [items.add_foods],
							});
						}
						isInsert = false;
					} else {
						arr.push({
							menu_id: items.menu_id,
							add_foods: [items.add_foods],
						});
					}
				});
				return arr;
			},
			//初始化 better-scroll
			_scrollInit() {
				//创建左边菜单栏滚动窗口
				this.category = new Bscroll(this.$refs.category, {
					click: true
				});
				//创建右边右边菜品滚动窗口
				this.footlist = new Bscroll(this.$refs.footList, {
					probeType: 3, //在 momentum 滚动动画运行过程中实时派发 scroll 事件
					click: true
				});
				this.footlist.on("scroll", pos => {
					//获取实时滚动的距离 使用scrollY接收
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			// 点击左菜单，同步又菜单
			selectLeft(index) {
				let rItem = this.$refs.rItem;
				let el = rItem[index];
				this.footlist.scrollToElement(el, 1000);
			},
			//获取li高度
			getHeight() {
				//获取每一个li的高度
				if (this.$refs.rItem) {
					const lis = this.$refs.rItem;
					//heightList的第一个元素为0
					let height = 0;
					this.heightList.push(height);
					//之后的高度即为当前li的高度加上之前面li的高度和
					lis.forEach(item => {
						height += item.clientHeight;
						this.heightList.push(height);
					});
				}
			},
		},
		computed: {
			...mapGetters('user', {
				canteenIdGetters: 'canteenIdGetters'
			}),
			//右菜单滚动 左菜单同步
			currentIndex() {
				const index = this.heightList.findIndex((item, index) => {
					return (
						this.scrollY >= this.heightList[index] &&
						this.scrollY < this.heightList[index + 1]
					);
				});
				return index > 0 ? index : 0;
			},
			//菜品数量计算
			dishCount() {
				let sum = 0;
				if (this.list.length > 0) {
					this.list.forEach((items, index) => {
						items.foods.forEach((item, key) => {
							if (item.count > 0) {
								sum += item.count;
							}
						});
					});
				}
				return sum;
			},
			//菜品总金额计算
			amount() {
				let sum = 0;
				if (this.list.length > 0) {
					this.list.forEach((items, index) => {
						items.foods.forEach((item, key) => {
							if (item.count > 0) {
								sum += item.price * item.count;
							}
						});
					});
				}
				return sum;
			},
			outLimited() {
				let islimited = [];
				let count = 0;
				for (let i in this.list) {
					count = this.list[i].foods.reduce(function(
							total,
							currentValue,
							currentIndex,
							arr
						) {
							return total + currentValue.count;
						},
						0);
					islimited.push(count >= this.list[i].count);
				}
				return islimited;
			},
		},
		mounted() {
			this.scrollH =
				window.innerHeight - (this.$refs.mealType.getBoundingClientRect().bottom + 74);
		},
		async created() {
			Toast.loading({
				forbidClick: true,
				duration: 0,
				message: '加载中...'
			});
			//若订单饭堂为当前用户所进入饭堂
			if (this.canteenIdGetters != this.$route.params.canteen_id) {
				const result2 = await bindCanteen({
					"canteen_id": this.$route.params.canteen_id
				});
				if (result2.errorCode == 0) {
					this.$store.commit('user/setCanteen', this.$route.params.canteen_id);
				} //切换饭堂
			};
			//获取菜品列表
			const result = await getFoodList({
				dinner_id: this.$route.params.dinner_id
			});
			if (result.errorCode == 0 && result.data.length > 0) {
				//初始化
				result.data.forEach(items => {
					items.foods.forEach(item => {
						item = Object.assign(item, {
							food_id: item.f_id,
							count: 0
						});
					});
				});
				//处理数据 按照日期进行分类设置一个新的日期map
				var dayMap = new Map();
				result.data.forEach((items, index) => {
					items.foods.forEach((item, key) => {
						if (!dayMap.has(item.day)) {
							//若日期map中不存在此日期 初始化该日期
							dayMap.set(item.day, [{
								category: items.category,
								count: items.count,
								id: items.id,
								foods: [item]
							}]);
						} else {
							//若存在，将菜品放置对菜类的菜品列表中
							dayMap.get(item.day).forEach((e, i) => {
								if (items.id != e.id) {
									dayMap.get(item.day).push({
										category: items.category,
										count: items.count,
										id: items.id,
										foods: [item]
									});
								} else {
									dayMap.get(item.day)[i].foods.push(item);
								}
							});
						}
					});
				});
				this.dayMap = dayMap;
				this.list = dayMap.get(this.$route.params.ordering_date);
				this.date = this.$route.params.orderDetail.ordering_date
				const result2 = await getDinnerInfo({
					day: this.date
				});
				console.log('订单详情：', this.$route.params.orderDetail);
				result2.data.forEach(item => {
					if (item.id == this.$route.params.orderDetail.dinner_id) {
						this.fixed = item.fixed;
					};
				});
				Toast.clear();
			}
			//因为 _scrollInit函数需要操作DOM，因此必须在DOM元素存在文档中才能获取DOM节点
			//因此在 nextTick回调函数里面调用可以是实现此功能
			this.$nextTick(() => {
				this._scrollInit();
				this.getHeight();
			});
			/* 将订单菜品放入已选列表，同时渲染页面菜品数量 */
			console.log('订单详情：', this.$route.params.orderDetail);
			const detail = this.$route.params.orderDetail;
			this.copyList = this.list
			detail.foods.forEach((items, index) => {
				this.list.forEach((item, key) => {
					item.foods.forEach((i, k) => {
						if (items.food_id == i.f_id) {
							this.list[key].foods[k].count = items.count;
						};
					});
				});
			});
		}
	}
</script>

<style scoped>
	.category {
		width: 30%;
		line-height: 50px;
	}

	.category li {
		background-color: #c8c9cc;
	}

	.footList {
		width: 100%;
		padding: 0 10px;
	}

	.footList li {
		width: 100%;
	}

	.footList p {
		margin: 10px 10px;
		font-size: 14px;
		text-align: left;
	}

	.footDetail {
		margin: 5px 0;
	}

	.active {
		background-color: #26a2ff !important;
		color: white !important;
	}
</style>
