<template>
	<!-- 菜品查询 -->
	<div>
		<!-- 顶部选择器 -->
		<div class="flex-row" style="justify-content: space-around;padding:10px ; width: auto;">
			<van-button class="myBtn" @click="mealShow = true">{{dinner}}
				<div class="mIcon" />
			</van-button>
			<!-- 			<van-button class="myBtn" @click="placeShow = true">{{place}}
				<div class="mIcon" />
			</van-button> -->
		</div>

		<!-- 日期选择 -->
		<div class="dateMenu" v-if="this.currentDate.length>0">
			<van-tabs color="#1989fa" @click="chooseDate">
				<van-tab v-for="(item,index) in currentDate" :title="$moment(item).format('MM-DD')" :key="index">
					<!-- 内容 {{ index }} -->
				</van-tab>
			</van-tabs>
		</div>
		<!-- 菜品及数量选择 -->
		<div class="flex-row" :style="'height:'+scrollH+'px'" style="overflow: hidden;">
			<!-- 左边随动菜单栏 -->
			<div class="category" ref="category">
				<ul>
					<li v-for="(item,index) in list" :class="{active:currentIndex === index}" :key="index" @click="selectLeft(index)"
					 ref='lItem'>{{item.category}}</li>
				</ul>
			</div>
			<!-- 右边菜品详情 -->
			<div class="footList" ref='footList'>
				<ul>
					<li v-for="(items,index) in list" :key="index" ref="rItem">{{items.category}}
						<div class="flex-row footDetail" style="" v-for="(item,key) in items.foods" :key="key">
							<van-image width="40%" :src="'http://canteen.tonglingok.com/'+item.img_url" fit="contain" />
							<!-- <img :src="'http://canteen.tonglingok.com/'+item.img_url" /> -->
							<div class="flex-column" style="justify-content: center;width: 60%;font-size: 12px;">
								<div class="flex-row" style="justify-content: space-between;align-items: center;">
									<p style="font-size: 13px;">{{item.name}} </p>
									<van-icon name="smile-o" size="25px" @click="openComment(item)" />
								</div>
								<p>主厨：{{item.chef}}</p>
								<p>详情：{{item.des}}</p>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<!-- 弹出层&&评价 -->
		<van-popup v-model="showComment" position="bottom" :style="{height:'70%'}">
			<!-- 更多评论 -->
			<div class="flex-row" style="justify-content: flex-end;padding: 10px;">
				<van-button size="small" @click="showComment = false">关闭</van-button>
			</div>
			<div v-for="(item,index) in comment.food.comments" :key="index" class="flex-row" style="border:1px solid #CCCCCC;">
				<!-- 评论左侧 -->
				<div style="margin: 5px 10px;width: 35%; line-height: 30px;">
					<img style="background-color: #26A2FF;width: 100%;height: 100px;" :src="comment.food.img_url" />
					<h4>{{comment.food.name}}</h4>
					<h4>主厨:{{comment.food.chef}}</h4>
				</div>
				<!-- 评论右侧 -->
				<div style="margin: auto 10px;width: 65%;">
					<div class="flex-row" style="align-items: center; margin: 5px;">
						<h4>味道</h4>
						<van-rate v-model="item.taste" :size="23" readonly allow-half void-icon="star" void-color="#eee" />
					</div>
					<div class="flex-row" style="align-items: center; margin: 5px;">
						<h4>服务</h4>
						<van-rate v-model="item.service" :size="23" readonly allow-half void-icon="star" void-color="#eee" />
					</div>
					<van-cell-group>
						<van-field style="padding: 0; border:1px solid #CCCCCC;height: 100px;" readonly v-model="item.remark" type="textarea"
						 autosize />
					</van-cell-group>
				</div>
			</div>
		</van-popup>
		<van-popup v-model="mealShow" position="bottom">
			<van-picker show-toolbar :columns="dinnerList" value-key="name" @cancel="mealShow = false" @confirm="dinnerEvent" />
		</van-popup>
		<!-- 		<van-popup v-model="placeShow" position="bottom">
			<van-picker show-toolbar :columns="placeList" @cancel="placeShow = false" @confirm="placeEvent" />
		</van-popup> -->
	</div>
</template>

<script>
	import {
		getMenuQuery,
		getComments
	} from '@/api/selfDish.js';
	import {
		getChooseDinner
	} from '@/api/user.js';
	import Bscroll from 'better-scroll';
	export default {
		data() {
			return {
				list: [], //菜品列表
				currentDate: [], //日期菜单
				dayMap: null,
				scrollH: '',
				scrollY: 0, //获取实时滚动位置
				heightList: [], //获取每一个li的高度
				showComment: false, //显示评论
				comment: {
					"food": {
						"id": 1,
						"name": "红烧牛肉",
						"price": 5,
						"img_url": "http://canteen.tonglingok.com/static/image/20190810/ab9ce8ff0e2c5adb40263641b24f36d4.png",
						"chef": "李大厨",
						"comments": [{
								"id": 4,
								"u_id": 3,
								"f_id": 1,
								"taste": 3,
								"service": 3,
								"remark": "4"
							},
							{
								"id": 3,
								"u_id": 3,
								"f_id": 1,
								"taste": 4,
								"service": 4,
								"remark": "3"
							},
							{
								"id": 2,
								"u_id": 3,
								"f_id": 1,
								"taste": 5,
								"service": 5,
								"remark": "2"
							}
						]
					},
					"canteenScore": {
						"taste": 4.3,
						"service": 4.3
					}
				}, //评论
				// placeShow: false,
				mealShow: false,
				// placeList: ['大饭堂', '小饭堂', '小卖部'],
				dinnerList: [],
				// place: '大饭堂',
				dinner: '餐次',
			}
		},
		methods: {
			//日期选择
			chooseDate(index, title) {
				this.list = this.dayMap.get(this.currentDate[index]);
				//调用日期选择接口（date为当前日期）
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
				this.footlist.on('scroll', (pos) => {
					//获取实时滚动的距离 使用scrollY接收         
					this.scrollY = Math.abs(Math.round(pos.y))
				});
			},
			// 点击左菜单，同步又菜单
			selectLeft(index) {
				let rItem = this.$refs.rItem
				let el = rItem[index]
				this.footlist.scrollToElement(el, 1000)
			},
			//获取li高度
			getHeight() {
				//获取每一个li的高度
				if (this.$refs.rItem) {
					const lis = this.$refs.rItem
					//heightList的第一个元素为0
					let height = 0
					this.heightList.push(height)
					//之后的高度即为当前li的高度加上之前面li的高度和
					lis.forEach(item => {
						height += item.clientHeight
						this.heightList.push(height)
					})
				}
			},
			//打开评论弹窗
			async openComment(e) {
				this.showComment = true;
				//获取菜品评论信息
				// console.log(e.f_id);
				// const result = await getComments({
				// 	food_id: e.f_id
				// });
				// if (result.errorCode) {
				// 	this.comment = result.data
				// }
			},
			//餐次选择
			async dinnerEvent(e) {
				this.dinner = e.name;
				this.dinner_id = e.id
				this.mealShow = false;

				const result = await getMenuQuery({
					dinner_id: this.dinner_id
				});
				console.log(result);
				if (result.errorCode == 0) {
					//将返回数据按照日期进行分类设置一个新的日期map
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
										console.log('11111',dayMap.get(item.day));
										dayMap.get(item.day).push({
											category: items.category,
											count: items.count,
											id: items.id,
											foods: [item]
										})
									}else{
										dayMap.get(item.day)[i].foods.push(item);
									}
								});
							};
						});
					});
					this.dayMap = dayMap;
					console.log('日期:', dayMap);
					//将日期放入数组中
					for (var [key, value] of dayMap) {
						this.currentDate.push(key);
					};
					//将日期排序
					this.currentDate.sort((a, b) => {
						return a > b ? 1 : -1;
					});
					this.list = dayMap.get(this.currentDate[0]);
				}
			},
			//地点选择
			// placeEvent(e) {
			// 	this.place = e;
			// 	this.placeShow = false;
			// }
		},
		mounted() {
			this.scrollH = window.innerHeight - this.$refs.category.getBoundingClientRect().top;
		},
		async created() {
			// 获取用户可选餐次
			const result = await getChooseDinner();
			if (result.errorCode == 0) {
				this.dinnerList = result.data
			}
			console.log(result);

			console.log(this.comment, '11111111');


			//因为 _scrollInit函数需要操作DOM，因此必须在DOM元素存在文档中才能获取DOM节点
			//因此在 nextTick回调函数里面调用可以是实现此功能
			this.$nextTick(() => {
				this._scrollInit()
				this.getHeight()
			})
		},
		computed: {
			//右菜单滚动 左菜单同步
			currentIndex() {
				const index = this.heightList.findIndex((item, index) => {
					return this.scrollY >= this.heightList[index] && this.scrollY < this.heightList[index + 1]
				})

				return index > 0 ? index : 0
			}
		},
	}
</script>

<style scoped>
	.dateMenu {
		width: auto;
		/* margin: 10px -20px 0 -20px; */
		margin: 10px;
	}

	.dateMenu ul {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		width: 100%;
		border-top: 1px solid #26a2ff;
		border-left: 1px solid #26a2ff;
	}

	.dateMenu li {
		width: 25%;
		line-height: 30px;
		background-color: white;
		color: #26a2ff;
		border-right: 1px solid #26a2ff;
		border-bottom: 1px solid #26a2ff;
	}

	.category {
		width: 28%;
		line-height: 50px;
	}

	.category li {
		background-color: #C8C9CC;
	}

	.footList {
		width: 100%;
		padding: 0 10px;
		text-align: left;
	}

	.footList li {
		width: 100%;
	}

	.footList p {
		margin: 2px 10px;
		text-align: left;
	}

	.footList van-image {
		width: 40px;
		/* background-color: #07C160; */
	}

	.footDetail {
		margin: 5px 0;
	}

	.active {
		background-color: #26a2ff !important;
		color: white !important;
	}

	h4 {
		margin: 0;
	}
</style>
