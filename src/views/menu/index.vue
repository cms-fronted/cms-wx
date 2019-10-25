<template>
	<!-- 菜品查询 -->
	<div>
		<!-- 顶部选择器 -->
		<div class="flex-row" style="justify-content: space-around;padding:10px 60px 10px 10px ; width: auto;">
			<van-button class="myBtn" @click="mealShow = true">{{meal}}
				<div class="mIcon" />
			</van-button>
			<van-button class="myBtn" @click="placeShow = true">{{place}}
				<div class="mIcon" />
			</van-button>
		</div>

		<!-- 日期选择 -->
		<div class="dateMenu">
			<van-tabs color="#1989fa" @click="chooseDate">
				<van-tab v-for="(item,index) in currentDate" :title="item" :key="index">
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
							<img :src="item.img_url" />
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
				<van-button size="small" @click="closeComment">关闭</van-button>
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
			<van-picker show-toolbar :columns="mealList" @cancel="mealShow = false" @confirm="mealEvent" />
		</van-popup>
		<van-popup v-model="placeShow" position="bottom">
			<van-picker show-toolbar :columns="placeList" @cancel="placeShow = false" @confirm="placeEvent" />
		</van-popup>
	</div>
</template>

<script>
	import Bscroll from 'better-scroll';
	export default {
		data() {
			return {
				list: [{
						"id": 1,
						"category": "荤菜",
						"status": 1,
						"count": 3,
						"foods": [{
							"id": 3,
							"day": "2019-09-07",
							"f_id": 1,
							"status": 1,
							"default": 2,
							"m_id": 1,
							"d_id": 6,
							"name": "红烧牛肉",
							"price": 5,
							"img_url": "/static/image/20190810/ab9ce8ff0e2c5adb40263641b24f36d4.png",
							"f_type": 2,
							"chef": "李大厨",
							"des": "适合**人群，有利于***不适合***人群",
							"materials": [{
									"id": 1,
									"f_id": 3,
									"name": "牛肉",
									"count": 15,
									"unit": "kg"
								},
								{
									"id": 2,
									"f_id": 3,
									"name": "土豆",
									"count": 10,
									"unit": "kg"
								},
								{
									"id": 3,
									"f_id": 3,
									"name": "西红柿",
									"count": 10,
									"unit": "kg"
								}
							]
						}]
					},
					{
						"id": 2,
						"category": "汤",
						"status": 2,
						"count": 0,
						"foods": [{
							"id": 3,
							"day": "2019-09-07",
							"f_id": 1,
							"status": 1,
							"default": 2,
							"m_id": 1,
							"d_id": 6,
							"name": "红烧牛肉",
							"price": 5,
							"img_url": "/static/image/20190810/ab9ce8ff0e2c5adb40263641b24f36d4.png",
							"f_type": 2,
							"chef": "李大厨",
							"des": "适合**人群，有利于***不适合***人群",
							"materials": [{
									"id": 1,
									"f_id": 3,
									"name": "牛肉",
									"count": 15,
									"unit": "kg"
								},
								{
									"id": 2,
									"f_id": 3,
									"name": "土豆",
									"count": 10,
									"unit": "kg"
								},
								{
									"id": 3,
									"f_id": 3,
									"name": "西红柿",
									"count": 10,
									"unit": "kg"
								}
							]
						}]
					}
				],
				currentDate: ['10-09', '10-10', '10-11', '10-12', '10-13'], //日期菜单
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
				},
				placeShow: false,
				mealShow: false,
				placeList: ['大饭堂', '小饭堂', '小卖部'],
				mealList: ['早餐', '中餐', '晚餐'],
				place: '大饭堂',
				meal: '早餐',
			}
		},
		methods: {
			//日期选择
			chooseDate(e) {
				this.date = this.currentDate[e];
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
				const lis = this.$refs.rItem
				//heightList的第一个元素为0
				let height = 0
				this.heightList.push(height)
				//之后的高度即为当前li的高度加上之前面li的高度和
				lis.forEach(item => {
					height += item.clientHeight
					this.heightList.push(height)
				})
			},
			//关闭评论弹窗
			closeComment() {
				this.showComment = false;
			},
			//打开评论弹窗
			openComment(e) {
				this.showComment = true;
				console.log(e.f_id);
			},
			//餐次选择
			mealEvent(e) {
				this.meal = e;
				this.mealShow = false;
			},
			//地点选择
			placeEvent(e) {
				this.place = e;
				this.placeShow = false;
			}
		},
		mounted() {
			console.log(window.innerHeight);
			console.log(this.$refs.category.getBoundingClientRect().top);
			this.scrollH = window.innerHeight - this.$refs.category.getBoundingClientRect().top;
		},
		created() {
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
		}
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

	.footList img {
		width: 40%;
		background-color: #07C160;
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
