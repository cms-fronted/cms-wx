<template>
	<!-- 个人选菜 -->
	<div class="flex-column" style>
		<!-- 餐次选择 -->
		<div class="flex-row" style="padding: 10px 20px 0 20px;">
			<van-button style="border-radius: 10px;width: 40%;" @click="mealPicker = true">
				{{dinner}}
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
		<div class="flex-row" style="justify-content: space-between;align-items:center;padding: 10px 20px 0 20px;" ref="aaa">
			<van-radio-group v-model="type">
				<van-radio v-if="dining_mode==1||dining_mode==3" style="margin: 10px 0;" :name="1">堂食</van-radio>
				<van-radio v-if="dining_mode==2|| dining_mode==3" :name="2">外卖</van-radio>
			</van-radio-group>
			<div style="font-size: 15px;color: #EE0A24;">
				<p style="margin:0 0 10px 0;">数量：{{dishCount}}</p>
				<p v-if="fixed != 1" style="margin: 0;">金额：{{amount}}元</p>
			</div>
		</div>
		<!-- 日期选择 -->
		<div class="dateMenu" v-if="currentDate.length !=0">
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
								<van-stepper v-model="item.count" min="0" button-size="40px" :disabled="isDisable" :show-plus="!outLimited[index]"
								 @plus="addMealCount(item,items.id,index,key)" @minus="reduceMealCount(item,items.id,index,key)" />
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<!-- 弹出层&&餐次 -->
		<van-popup id="myCom" v-model="mealPicker" position="bottom">
			<van-picker :columns="dinnerList" value-key="name" show-toolbar @cancel="mealPicker = false" @confirm="chooseMeal" />
		</van-popup>
		<!-- 弹出层&&评价 -->
		<van-popup id="myCome" v-model="showComment" position="bottom" :style="{height:'70%'}">
			<!-- 弹出层顶部 -->
			<van-list class="van-clearfix" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
				<div class="flex-row" style="justify-content: space-around;align-items: center;">
					<div>
						<p style="margin: 0;">{{comment.canteenScore.service}}</p>
						<p style="margin: 0;">饭堂评分</p>
					</div>
					<div>
						<div class="flex-row" style="align-items: center; margin: 5px;">
							<h4>味道</h4>
							<van-rate v-model="myComment.canteen.taste" allow-half void-icon="star" void-color="#eee" />
						</div>
						<div class="flex-row" style="align-items: center; margin: 5px;">
							<h4>服务</h4>
							<van-rate v-model="myComment.canteen.service" allow-half void-icon="star" void-color="#eee" />
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
						<van-image style="background-color: #26A2FF;width: 100%;height: 100px;" :src="comment.food.img_url" />
						<h4>{{comment.food.name}}</h4>
						<h4>主厨:{{comment.food.chef}}</h4>
					</div>
					<!-- 评论右侧 -->
					<div style="margin: auto 10px;width: 65%;">
						<div class="flex-row" style="align-items: center; margin: 5px;">
							<h4>味道</h4>
							<van-rate v-model="myComment.foods.taste" :size="23" void-icon="star" void-color="#eee" />
						</div>
						<div class="flex-row" style="align-items: center; margin: 5px;">
							<h4>服务</h4>
							<van-rate v-model="myComment.foods.service" :size="23" void-icon="star" void-color="#eee" />
						</div>
						<van-cell-group>
							<van-field style="padding: 0; border:1px solid #CCCCCC;height: 100px;" input-align="left" v-model="myComment.foods.remark"
							 type="textarea" placeholder="请输入留言" autosize />
						</van-cell-group>
						<div class="flex-row" style="justify-content: space-around;margin: 10px auto;">
							<van-button size="small" @click="showComment = false">取消</van-button>
							<van-button size="small" @click="submitComment">完成</van-button>
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
			</van-list>
		</van-popup>
	</div>
</template>

<script>
	import {
		getChooseDinner
	} from "@/api/user.js";
	import {
		getFoodList,
		getDiningType,
		getDinnerInfo,
		getComments,
		saveFoodComment,
		saveCanteenComment
	} from "@/api/selfDish.js";
	import {
		Toast
	} from "vant";
	import Bscroll from "better-scroll";
	export default {
		data() {
			return {
				list: [], //菜品列表
				dinner: "早餐", //默认餐次
				dinner_id: null, //餐次id
				dinnerList: ["早餐", "中餐", "晚餐"], //餐次列表
				mealPicker: false, //餐次选择弹出窗
				count: 1, //订餐数量
				dining_mode: "", //就餐方式类型1｜食堂；2｜外卖；3｜全部
				type: 1, //就餐类别
				currentDate: [], //日期菜单
				date: "", //订餐日期
				scrollH: "",
				scrollY: 0, //获取实时滚动位置
				heightList: [], //获取每一个li的高度
				showComment: false, //显示评论
				comment: {
					food: {
						id: 1,
						name: "红烧牛肉",
						price: 5,
						img_url: "http://canteen.tonglingok.com/static/image/20190810/ab9ce8ff0e2c5adb40263641b24f36d4.png",
						chef: "李大厨",
						comments: [{
								id: 4,
								u_id: 3,
								f_id: 1,
								taste: 3,
								service: 3,
								remark: "4"
							},
							{
								id: 3,
								u_id: 3,
								f_id: 1,
								taste: 4,
								service: 4,
								remark: "3"
							},
							{
								id: 2,
								u_id: 3,
								f_id: 1,
								taste: 5,
								service: 5,
								remark: "2"
							},
							{
								id: 2,
								u_id: 3,
								f_id: 1,
								taste: 5,
								service: 5,
								remark: "2"
							},
							{
								id: 2,
								u_id: 3,
								f_id: 1,
								taste: 5,
								service: 5,
								remark: "2"
							},
							{
								id: 2,
								u_id: 3,
								f_id: 1,
								taste: 5,
								service: 5,
								remark: "2"
							}
						]
					},
					canteenScore: {}
				}, //评价
				myComment: {
					canteen: {
						taste: 1,
						service: 1
					},
					foods: {
						taste: 1,
						service: 1,
						remark: ""
					}
				}, //我的评价
				message: "", //我的评论
				chooseFoodId: null, //当前评论选中菜品id
				products: [], //已选商品列表
				dayMap: null, //整好配置
				isInsert: false, //是否已插入
				isSimilar: false, //是否为同类
				submitValidate: "", //当前添加商品的日期
				pass: false, //是否允许提交
				fixed: null, //是否为固定金额
				loading: false, //
				finished: false, //
				total: 0, //评论总数
				current_page: 1, //当前页码
				per_page: 6, //一页显示多少条数据
				last_page: 0 //最后的页码
			};
		},
		methods: {
			/* 
			 选择餐次确认
			 */
			async chooseMeal(e) {
				Toast.loading({
					message: "加载中...",
					forbidClick: true,
					duration: 0
				});
				this.dinner = e.name;
				this.dinner_id = e.id;
				this.mealPicker = false;
				//获取菜品列表
				const result = await getFoodList({
					dinner_id: e.id
				});
				if (result.errorCode == 0) {
					//初始化
					this.dayMap = null;
					this.currentDate = [];
					this.list = [];
					this.date = "";
					this.products = [];
					this.submitValidate = "";
					if (result.data.length > 0) {
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
						//将日期放入数组中
						for (var [key, value] of dayMap) {
							this.currentDate.push(key);
						}
						//将日期排序
						this.currentDate.sort((a, b) => {
							return a > b ? 1 : -1;
						});
						this.list = dayMap.get(this.currentDate[0]);
						this.date = this.currentDate[0];

						const result2 = await getDinnerInfo({
							day: this.date
						});
						result2.data.forEach(item => {
							if (item.id == e.id) {
								this.fixed = item.fixed;
							}
						});
					}
				}
				//因为 _scrollInit函数需要操作DOM，因此必须在DOM元素存在文档中才能获取DOM节点
				//因此在 nextTick回调函数里面调用可以是实现此功能
				this.$nextTick(() => {
					this._scrollInit();
					this.getHeight();
				});
				Toast.clear();
			},
			/* 
			 订餐数量选择
			 */
			changeCount(e) {
				this.count = this.$refs.countInput.value;
			},
			/* 
			 日期选择
			 */
			chooseDate(index, title) {
				console.log(index, title);
				console.log(this.currentDate[index]);
				this.date = this.currentDate[index];
				// this.submitValidate = this.currentDate[index];
				this.list = this.dayMap.get(this.currentDate[index]);
				//调用日期选择接口（date为当前日期）
			},
			/*
			 *增加菜品数量
			 */
			addMealCount(e, menu_id, i, k) {
				if (this.products.length != 0) {
					//若已选商品列表不为空
					this.products.forEach((items, index) => {
						items.foods.forEach((item, key) => {
							if (items.menu_id == menu_id) {
								//判断是同菜类
								this.isSimilar = true;
								if (item.id == e.id) {
									//同类已存在
									this.products[index].foods[key] = e;
									console.log("已存在");
									this.isInsert = true;
								}
							}
						});
						//同类不存在
						if (this.isSimilar && !this.isInsert) {
							this.products[index].foods.push(e);
							console.log("同类不存在");
							this.isInsert = true;
						}
					});
					if (!this.isInsert) {
						//若未插入(非同类、非存在)
						this.products.push({
							menu_id: menu_id,
							foods: [e]
						});
						console.log("不同类不存在");
					}
				} else {
					//已选商品列表为空
					this.products.push({
						menu_id: menu_id,
						foods: [e]
					});
					console.log("空");
				}
				this.submitValidate = this.date;
				this.isInsert = false;
				this.isSimilar = false;
			},
			/* 
			 减少已选商品
			 */
			reduceMealCount(e, menu_id, i, k) {
				this.products.forEach((items, index) => {
					items.foods.forEach((item, key) => {
						if (items.menu_id == menu_id) {
							//若为同同类
							if (item.count == 1 && item.id == e.id) {
								// 若为最后一个
								this.products[index].foods.splice(key, 1);
								if (this.products[index].foods.length == 0) {
									//内层数组为空 将外层数组删除
									this.products.splice(index, 1);
								}
							} else if (item.id == e.id) {
								//若不是最后一个
								this.products[index].foods[key] = Object.assign(
									this.products[index].foods[key],
									e
								);
							}
						}
					});
				});
				if (this.products.length == 0) {
					this.submitValidate = "";
				}
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
			/* 
			关闭评论弹窗 
			 */
			closeComment() {
				(this.total = 0), //评论总数
				(this.current_page = 1), //当前页码
				(this.last_page = 0); //最后的页码
				this.showComment = false;
			},
			/* 
			 提交评论
			 */
			async submitComment() {
				await saveCanteenComment(this.myComment.canteen);
				await saveFoodComment({
					food_id: this.chooseFoodId,
					taste: this.myComment.foods.taste,
					service: this.myComment.foods.service,
					remark: this.myComment.foods.remark
				});
				//调用提交评论接口(饭堂评价 菜品评价)
				this.showComment = false;
			},
			/* 
			 打开评论弹窗
			 */
			async openComment(e) {
				this.chooseFoodId = e.f_id;
				console.log("菜品id", e);
				const result = await getComments({
					food_id: e.f_id,
					page: 1,
					size: 0
				});
				console.log(result);
				if (result.errorCode == 0) {
					// this.comment = result.data;
				}
				this.showComment = true;
			},
			/* 加载更多数据 */
			onLoad() {
				// 异步更新数据
				console.log("11111");
				setTimeout(() => {
					for (let i = 0; i < 10; i++) {
						console.log(1123435);
					}
					// 加载状态结束
					this.loading = false;

					// 数据全部加载完成
					if (this.list.length >= 40) {
						this.finished = true;
					}
				}, 500);
			},

			//提交订单
			async submitOrder(e) {
				Toast.loading({
					message: "加载中...",
					forbidClick: true,
					duration: 0
				});
				//获取餐次配置信息
				/* 1.餐次金额是否为标准金额
				2.判断当前提交日期是否符合订餐日期规则
					type type_number对应
				3.判断订餐数量是否超过可订餐数量
				4.判断所选菜品种类数量计算是否超过该菜类可选数量*/
				if (this.dishCount == 0) {
					Toast.fail("请选择菜品！");
					return;
				}
				if (this.count == 0) {
					Toast.fail("请输入订餐数量！");
					return;
				}

				const result = await getDinnerInfo({
					day: this.submitValidate
				});
				if (result.errorCode == 0) {
					console.log("配置信息：", result);
					let nowDay = new Date(); //当前日期
					let fixed = result.data[0].fixed; //餐次金额
					let dinner = null; //当前所选餐次的配置信息
					let menus = null; //当前菜品配置信息
					result.data.forEach((item, index) => {
						if (item.id == this.dinner_id) {
							fixed = item.fixed;
							dinner = item;
							menus = item.menus;
						}
					}); //格式化数据
					console.log("menus：", menus);
					/* 超日期 */
					// dinner.type 时间设置类别：day | week
					// dinner.limit_time 订餐限制时间
					//dinner.type_number 订餐时间类别对应数量（week：0-6；周日-周六）
					dinner.type == "week" && diner.type_number == 0 ?
						(dinner.type_number = 7) :
						dinner.type_number;
					if (
						this.$moment(this.submitValidate)
						.subtract(dinner.type_number, dinner.type)
						.isBefore(nowDay)
					) {
						console.log(
							"请选择" +
							this.$moment(nowDay)
							.add(dinner.type, dinner.type_number)
							.format("MM-DD") +
							"之后的菜品"
						);
						Toast.fail(
							"请选择" +
							this.$moment(nowDay)
							.add(dinner.type, dinner.type_number)
							.format("MM-DD") +
							"之后的菜品"
						);
						return;
					}

					/* 订餐数量 */
					//dinner.ordered_count 可订餐数量
					//dinner.ordering_count已定餐数量
					if (dinner.ordering_count - dinner.ordered_count < this.count) {
						if (dinner.ordering_count - dinner.ordered_count == 0) {
							Toast.fail("今日可订餐数量已达上限");
						} else {
							Toast.fail(
								"订餐数量不可超过:" +
								(dinner.ordering_count - dinner.ordered_count) +
								"份"
							);
						}
						return;
					}
					/* 超种类数量 */
					// menus[].count//

					//统计已选商品根据菜品统计选菜的数量
					let list = this.products;

					this.products.forEach((items, index) => {
						let sum = 0;
						items.foods.forEach((item, key) => {
							sum += item.count;
						});
						list[index] = Object.assign(list[index], {
							count: sum
						});
					});
					console.log("我的列表:", list);
					list.forEach((items, index) => {
						menus.forEach((item, key) => {
							if (
								items.menu_id == item.id &&
								items.count > item.count &&
								item.status == 1
							) {
								Toast.fail(item.category + "不可超过" + item.count + "份");
								this.pass = true;
							}
						});
					});
					if (this.pass) {
						this.pass = false;
						return;
					}
				}

				this.$router.push({
					name: "placeorder",
					params: {
						orderType: 1,
						ordering_date: this.submitValidate,
						dinner_id: this.dinner_id,
						dinner: this.dinner,
						type: this.type,
						count: this.count,
						detail: this.products
					}
				});
				Toast.clear();
			}
		},
		mounted() {
			this.scrollH =
				window.innerHeight - (this.$refs.aaa.getBoundingClientRect().bottom + 74);
			this.$bus.$on('updatePage',async () => {
				Toast.loading({
					message: "加载中",
					mask: true,
					duration: 0,
					forbidClick: true
				});
				//初始化数据
				
				//获取用户可选餐次
				const result = await getChooseDinner();
				if (result.errorCode == 0) {
					this.dinner = result.data[0].name
					this.dinner_id = result.data[0].id;
					this.dinnerList = result.data;
				}
				//获取当前饭堂就餐类型
				const result2 = await getDiningType();
				console.log(result2);
				if (result2.errorCode == 0) {
					this.dining_mode = result2.data.dining_mode;
				}
				//获取菜品列表
				const result3 = await getFoodList({
					dinner_id: this.dinner_id
				});
				this.list = [];
				this.currentDate = [];
				Toast.clear();
			});
		},
		async created() {
			Toast.loading({
				message: "加载中",
				mask: true,
				duration: 0,
				forbidClick: true
			});
			//初始化
			//获取用户可选餐次
			const result = await getChooseDinner();
			if (result.errorCode == 0) {
				this.dinner = result.data[0].name
				this.dinner_id = result.data[0].id;
				this.dinnerList = result.data;
			}
			//获取当前饭堂就餐类型
			const result2 = await getDiningType();
			console.log(result2);
			if (result2.errorCode == 0) {
				this.dining_mode = result2.data.dining_mode;
			}
			//获取菜品列表
			const result3 = await getFoodList({
				dinner_id: this.dinner_id
			});
			Toast.clear();
		},
		computed: {
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
			dishCount() {
				let sum = 0;
				this.products.forEach((items, index) => {
					items.foods.forEach((item, key) => {
						sum += item.count;
					});
				});
				return sum;
			},
			amount() {
				let sum = 0;
				this.products.forEach((items, index) => {
					items.foods.forEach((item, key) => {
						sum += item.price * item.count;
					});
				});
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
			isDisable() {
				if (this.date == this.submitValidate || this.submitValidate == "") {
					return false;
				}
				return true;
			}
		}
	};
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

	h4 {
		margin: 0;
	}
</style>
