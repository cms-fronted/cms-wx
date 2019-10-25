<template>
	<!-- 小卖部 -->
	<div>
		<!-- 顶部购买方式&&按钮 -->
		<div class="flex-row" style="align-items: center;justify-content: space-around;padding: 15px 0;background-color: #F2F3F5;">
			<div style="width: auto;">
				<div class="flex-row" style="justify-content: space-around;">
					<h4 style="margin: 10px 0;">数量：3 </h4>
					<h4 style="margin: 10px 0;">金额：10元</h4>
				</div>
				<van-radio-group v-model="distribution" class="flex-row felx-center" style="justify-content: space-around;">
					<van-radio style="margin-right: 10px;" name="1">到店自提</van-radio>
					<van-radio name="2">送货上门</van-radio>
				</van-radio-group>
			</div>
			<van-button type="info" @click="submitOrder">完成</van-button>
		</div>
		<!-- 菜品及数量选择 -->
		<div class="flex-row" :style="'height:'+scrollH+'px'" style="overflow: hidden;padding: 10px 0;">
			<!-- 左边随动菜单栏 -->
			<div class="category" ref="category">
				<ul>
					<li v-for="(item,index) in goods" :class="{active:currentIndex === index}" :key="index" @click="selectLeft(index)"
					 ref='lItem'>{{item.name}}</li>
				</ul>
			</div>
			<!-- 右边菜品详情 -->
			<div class="footList" ref='footList'>
				<ul>
					<li v-for="(items,index) in goods" :key="index" ref="rItem">{{items.name}}
						<div class="flex-row footDetail" style="" v-for="(item,key) in items.products" :key="key">
							<img :src="item.image" />
							<div class="flex-column" style="justify-content: center;width: 55%">
								<div class="flex-row" style="justify-content: space-between;align-items: center;">
									<p>{{item.name}} </p>
									<van-icon name="smile-o" size="25px" @click="openComment(item)" />
								</div>
								<p>￥：{{item.price}}{{item.unit}}</p>
								<van-stepper value='0' min="0" button-size="40px" :max="items.count" @plus="mealCount()" />
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<!-- 评论弹窗 -->
		<van-popup v-model="showComment" position="bottom" :style="{height:'70%'}">
			<div class="flex-row" style="justify-content: space-around;align-items: center;">
				<div>
					<p style="margin: 0;">4.5</p>
					<p style="margin: 0;">商品评分</p>
				</div>
				<div>
					<div class="flex-row" style="align-items: center; margin: 5px;">
						<h4>味道</h4>
						<van-rate v-model="comment.data[0].taste" :size="23" allow-half void-icon="star" readonly void-color="#eee" />
					</div>
					<div class="flex-row" style="align-items: center; margin: 5px;">
						<h4>服务</h4>
						<van-rate v-model="comment.data[0].service" :size="23" allow-half void-icon="star" readonly void-color="#eee" />
					</div>
				</div>
				<div>
					<van-button @click="closeComment">关闭</van-button>
				</div>
			</div>

			<div class="flex-row" style="align-items: center; margin: 5px;">
				<h4>味道</h4>
				<van-rate v-model="myComment.taste" :size="23" allow-half void-icon="star" void-color="#eee" />
			</div>
			<div class="flex-row" style="align-items: center; margin: 5px;">
				<h4>服务</h4>
				<van-rate v-model="myComment.service" :size="23" allow-half void-icon="star" void-color="#eee" />
			</div>
			<van-cell-group style="width: 90%;margin: 5px;">
				<van-field style="padding: 0; border:1px solid #CCCCCC;height: 100px;" input-align="left" v-model="myComment.remark" type="textarea"
				 placeholder="请输入留言" autosize rows="2" />
			</van-cell-group>
			<div class="flex-row" style="justify-content: space-around;margin: 10px auto;">
				<van-button size="small" @click="showComment = false"> 取消 </van-button>
				<van-button size="small" @click="submitComment()"> 完成 </van-button>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import Bscroll from 'better-scroll';
	import {Toast} from 'vant';
	export default {
		data() {
			return {
				distribution: '',
				goods: [{
					"id": 2,
					"name": "生鲜",
					"products": [{
							"id": 5,
							"category_id": 2,
							"name": "鸡蛋1",
							"price": "100.0",
							"unit": "元/500g",
							"image": "http://canteen.tonglingok.com/static/image"
						},
						{
							"id": 6,
							"category_id": 2,
							"name": "鸡蛋2",
							"price": "100.0",
							"unit": "元/500g",
							"image": "http://canteen.tonglingok.com/static/image"
						}
					]
				}],
				scrollH: '',
				scrollY: 0, //获取实时滚动位置
				heightList: [], //获取每一个li的高度
				comment: {
					"total": 2,
					"per_page": "10",
					"current_page": 1,
					"last_page": 1,
					"data": [{
							"id": 4,
							"u_id": 3,
							"product_id": 1,
							"taste": 3,
							"service": 3,
							"remark": "4"
						},
						{
							"id": 3,
							"u_id": 3,
							"product_id": 1,
							"taste": 4,
							"service": 4,
							"remark": "3"
						},
						{
							"id": 2,
							"u_id": 3,
							"product_id": 1,
							"taste": 5,
							"service": 5,
							"remark": "2"
						}
					]
				},
				showComment: false, //显示评论
				myComment: {
					taste: 0,
					service: 0,
					remark: '',
					product_id: ''
				}, //我的评价
			}
		},
		methods: {
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
				console.log('提交评论：',this.myComment);
				//调用提交评论接口(小卖部评价 商品评价)
				this.showComment = false;
				Toast.success('提交成功');
			},
			//打开评论弹窗
			openComment(e) {
				this.showComment = true;
				console.log(e.name);
				const myComment = Object.assign(this.myComment, {
					product_id: e.id
				})
				this.myComment = myComment;
			},
			//提交订单
			submitOrder(e) {
				this.$router.push({
					path: '/placeorder'
				});
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
	.category {
		width: 30%;
		line-height: 50px;
	}

	.category li {
		background-color: #F2F3F5;
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
