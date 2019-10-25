<template>
	<!-- 个人选菜 -->
	<div class="flex-column" style="">
		<!-- 餐次选择 -->
		<div class="flex-row" style="padding: 10px 20px 0 20px;">
			<van-button style="border-radius: 10px;width: 40%;" @click="showMeal">{{meal}}
				<van-icon name="arrow-down" />
			</van-button>
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
		<div class="flex-row" style="justify-content: space-between;align-items:center;padding: 10px 20px 0 20px;">
			<van-radio-group v-model="radio">
				<van-radio style="margin: 10px 0;" name="1">堂食（默认）</van-radio>
				<van-radio name="2">外卖</van-radio>
			</van-radio-group>
			<div style="font-size: 15px;color: #EE0A24;">
				<p style="margin:0 0 10px 0;">数量：{{count}}</p>
				<p style="margin: 0;">金额：{{amount}}元</p>
			</div>
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
							<div class="flex-column" style="justify-content: center;width: 55%">
								<div class="flex-row" style="justify-content: space-between;align-items: center;">
									<p>{{item.name}} </p>
									<van-icon name="smile-o" size="25px" @click="openComment(item)" />
								</div>
								<p>￥：{{item.price}}</p>
								<van-stepper value='0' min="0" button-size="40px" :max="items.count" @plus="mealCount()" />
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<!-- 弹出层&&餐次 -->
		<van-popup v-model="mealPicker" position="bottom">
			<van-picker :columns="mealList" show-toolbar @cancel="mealPicker = false" @confirm="chooseMeal" />
		</van-popup>
		<!-- 弹出层&&评价 -->
		<van-popup v-model="showComment" position="bottom" :style="{height:'70%'}">
			<!-- 弹出层顶部 -->
			<div class="flex-row" style="justify-content: space-around;align-items: center;">
				<div>
					<p style="margin: 0;">{{comment.canteenScore.service}}</p>
					<p style="margin: 0;">饭堂评分</p>
				</div>
				<div>
					<div class="flex-row" style="align-items: center; margin: 5px;">
						<h4>味道</h4>
						<van-rate v-model="comment.canteenScore.taste" allow-half void-icon="star" readonly void-color="#eee" />
					</div>
					<div class="flex-row" style="align-items: center; margin: 5px;">
						<h4>服务</h4>
						<van-rate v-model="comment.canteenScore.service" allow-half void-icon="star" readonly void-color="#eee" />
					</div>
				</div>
				<div>
					<van-button @click="closeComment">关闭</van-button>
				</div>
			</div>
			<!-- 我的评论 -->
			<div class="flex-row" style="border:1px solid #CCCCCC;">
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
						<van-rate v-model="myComment.taste" :size="23" allow-half void-icon="star" void-color="#eee" />
					</div>
					<div class="flex-row" style="align-items: center; margin: 5px;">
						<h4>服务</h4>
						<van-rate v-model="myComment.service" :size="23" allow-half void-icon="star" void-color="#eee" />
					</div>
					<van-cell-group>
						<van-field style="padding: 0; border:1px solid #CCCCCC;height: 100px;" input-align="left" v-model="message" type="textarea"
						 placeholder="请输入留言" autosize />
					</van-cell-group>
					<div class="flex-row" style="justify-content: space-around;margin: 10px auto;">
						<van-button size="small" @click="showComment = false"> 取消 </van-button>
						<van-button size="small" @click="submitComment()"> 完成 </van-button>
					</div>
				</div>
			</div>
			<!-- 更多评论 -->
			更多评论
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
								"id": 2,
								"day": "2019-09-03",
								"f_id": 1,
								"status": 2,
								"m_id": 1,
								"d_id": 6,
								"name": "红烧牛肉",
								"price": 5,
								"img_url": "/static/image/20190810/ab9ce8ff0e2c5adb40263641b24f36d4.png",
								"f_type": 2
							},
							{
								"id": 3,
								"day": "2019-09-04",
								"f_id": 1,
								"status": 1,
								"m_id": 1,
								"d_id": 6,
								"name": "红烧牛肉",
								"price": 5,
								"img_url": "/static/image/20190810/ab9ce8ff0e2c5adb40263641b24f36d4.png",
								"f_type": 2
							}
						]
					},
					{
						"id": 2,
						"category": "菜",
						"status": 2,
						"count": 0,
						"foods": [{
							"id": 3,
							"day": "2019-09-04",
							"f_id": 1,
							"status": 1,
							"m_id": 1,
							"d_id": 6,
							"name": "生菜",
							"price": 3,
							"img_url": "/static/image/20190810/ab9ce8ff0e2c5adb40263641b24f36d4.png",
							"f_type": 2
						}, {
							"id": 3,
							"day": "2019-09-04",
							"f_id": 1,
							"status": 1,
							"m_id": 1,
							"d_id": 6,
							"name": "生菜",
							"price": 3,
							"img_url": "/static/image/20190810/ab9ce8ff0e2c5adb40263641b24f36d4.png",
							"f_type": 2
						}, {
							"id": 3,
							"day": "2019-09-04",
							"f_id": 1,
							"status": 1,
							"m_id": 1,
							"d_id": 6,
							"name": "生菜",
							"price": 3,
							"img_url": "/static/image/20190810/ab9ce8ff0e2c5adb40263641b24f36d4.png",
							"f_type": 2
						}, {
							"id": 3,
							"day": "2019-09-04",
							"f_id": 1,
							"status": 1,
							"m_id": 1,
							"d_id": 6,
							"name": "生菜",
							"price": 3,
							"img_url": "/static/image/20190810/ab9ce8ff0e2c5adb40263641b24f36d4.png",
							"f_type": 2
						}]
					}
				], //菜品列表
				meal: '早餐', //默认餐次
				mealList: ['早餐', '中餐', '晚餐'], //餐次列表
				mealPicker: false, //餐次选择弹出窗
				count: 1, //订餐数量
				amount: 15, //订餐金额
				radio: '1', //就餐方式单选框
				currentDate: ['10-09', '10-10', '10-11', '10-12', '10-13'], //日期菜单
				date: '', //订餐日期
				value: 0,
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
						"taste": 2,
						"service": 3.6
					}
				}, //评价
				myComment: {
					taste: 0,
					service: 0
				}, //我的评价
				message: '' //我的评论
			}
		},
		methods: {
			// 显示餐次弹窗
			showMeal() {
				this.mealPicker = true;
			},
			//选择餐次确认
			chooseMeal(e) {
				this.meal = e;
				this.mealPicker = false;
			},
			//订餐数量选择
			changeCount(e) {
				// console.log(this.$refs.countInput.value);
				this.count = this.$refs.countInput.value;
			},
			//日期选择
			chooseDate(e) {
				this.date = this.currentDate[e];
				//调用日期选择接口（date为当前日期）
			},
			//菜品数量
			mealCount(e) {
				console.log('1111111111', e);
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
			//提交评论

			submitComment(e) {

				// {
				// 	"food_id": 1,
				// 	"taste": 5,
				// 	"service": 5 "remark": "味道好极了",
				// } {
				// 	"taste": 5,
				// 	"service": 5
				// }
				console.log(this.comment.food.id);
				console.log(this.myComment);
				//调用提交评论接口(饭堂评价 菜品评价)
				this.showComment = false;
			},
			//打开评论弹窗
			openComment(e) {
				this.showComment = true;
				console.log(e.f_id);
			},
			//提交订单
			submitOrder(e) {
				this.$router.push({path:'/placeorder'});
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
		width: 30%;
		line-height: 50px;
	}

	.category li {
		background-color: #C8C9CC;
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

	.footList img {
		width: 45%;
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
