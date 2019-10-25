<template>
	<div id="dish">
		<!-- 选择器 -->
		<div class="picker flex-row">
			<van-button class="btn" type="default" @click="timeEvent">{{$moment(date).format("YYYY-MM-DD")}}
				<van-icon name="arrow-down" />
			</van-button>
			<van-button class="btn" type="default" @click="placePick">{{place}}
				<van-icon name="arrow-down" />
			</van-button>
			<van-button class="btn" type="default" @click="typePick">{{type}}
				<van-icon name="arrow-down" />
			</van-button>
		</div>
		<!-- 		<van-sticky>
			<div id="tabs" class="flex-row" style="width: 100%;justify-content: space-around;">
				<a href="#tab1">早餐</a><a href="#tab2">午餐</a><a href="#tab3">晚餐</a><a href="#tab4">可配置</a>
			</div>
		</van-sticky> -->
		<!-- tab栏 -->
		<!-- 	<van-tabs v-model="active" swipeable sticky>
			<van-tab title="早餐">
				<table class="tables" border="0" cellspacing="0" cellpadding="0">
					<tr height="45">
						<td>图片</td>
						<td width="22%">菜品名称</td>
						<td>单价</td>
						<td>上架</td>
						<td>默认</td>
					</tr>
					<tr v-for="(item,index) in table1" :key="index">
						<td><img :src="item.imgSrc" /></td>
						<td>{{item.name}}</td>
						<td>{{item.price}}</td>
						<td>
							<van-checkbox v-model="item.shelf" class="cbox" />
						</td>
						<td>
							<van-checkbox v-model="item.def" class="cbox" />
						</td>
					</tr>
				</table>
			</van-tab>
		</van-tabs> -->
		<!-- 餐次选择tab -->
		<div class="foodMenu" ref="foodMenu">
			<ul>
				<li v-for="(item,index) in foodMenu" :key="index" :class="{active: currentIndex === index}" @click="selectLeft(index)"
				 ref="tItem">{{item}}</li>
			</ul>
		</div>
		<ul class="flex-row title-content">
			<li style="width: 25%;">图片</li>
			<li style="width: 25%;">菜品名称</li>
			<li style="width: 10%;">单价</li>
			<li style="width: 15%;">上架</li>
			<li style="width: 15%;">默认</li>
		</ul>
		<!-- 左边菜单栏 -->
		<div class="footList" ref="footList" :style="'height:'+scrollH+'px'">
			<ul>
				<li v-for="(items, index) in footList" :key="index" ref="bItem">
					<!-- <p>{{ items.title}}</p> -->
					<!-- 右边菜品 -->
					<div v-for="(item, key) in items.data" :key="key">
						<table border="0" cellpadding="0" cellspacing="0" style="border:#FFFFFF;">
							<tr>
								<td style="width: 25%;"><img :src="item.imgSrc" style="width: 100%;height: 60px;" /></td>
								<td style="width: 25%;">{{item.name}}</td>
								<td style="width: 10%;">{{item.price}}</td>
								<td style="width: 15%;">
									<van-checkbox v-model="item.shelf" class="cbox" @click="shelfClick(index,key)" />
								</td>
								<td style="width: 15%;">
									<van-checkbox v-model="item.def" class="cbox" />
								</td>
							</tr>
						</table>
					</div>
				</li>
			</ul>
		</div>


		<!-- 弹出层&时间选择器 -->
		<van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
			<van-datetime-picker v-model="currentDate" @cancel="timeEvent" type="date" @confirm="timeEvent" />
		</van-popup>
		<!-- 弹出层&饭堂选择器 -->
		<van-popup v-model="show1" position="bottom">
			<van-picker show-toolbar :columns="placeList" @cancel="show1 = false" @confirm="placeEvent" />
		</van-popup>
		<!-- 弹出层&菜类型选择器 -->
		<van-popup v-model="show2" position="bottom">
			<van-picker show-toolbar :columns="typeList" @cancel="show2 = false" @confirm="typeEvent" />
		</van-popup>
	</div>
</template>

<script>
	import Bscroll from 'better-scroll'
	export default {
		name: 'dish',
		data() {
			return {
				active: 0,
				//better scroll
				foodMenu: ['早餐', '中餐', '晚餐', '可配置'],
				footList: [{
						title: '早餐',
						data: [{
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}]
					},
					{
						title: '中餐',
						data: [{
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, ]
					},
					{
						title: '晚餐',
						data: [{
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, ]
					}, {
						title: '可配置',
						data: [{
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, {
							imgSrc: require('../../assets/logo.png'),
							name: '豆浆',
							price: '1',
							shelf: true,
							def: false
						}, ]
					},
				],
				scrollY: 0, //获取实时滚动位置
				heightList: [], //获取每一个高度

				date: '', //时间
				place: '大饭堂', //地点
				type: '全部', //类型
				currentDate: new Date(), //临时时间
				show: false,
				show1: false,
				show2: false,
				typeList: ['全部', '荤菜', '素菜'],
				placeList: ['大饭堂', '小饭堂', '小卖部'],
				sysHeight: null,
				scrollH: null
			}
		},
		methods: {
			// 时间选择器事件
			timeEvent(e) {
				if (!e) {} else if (e.isTrusted) {} else {
					this.date = this.currentDate
				}
				this.show = !this.show
			},
			placeEvent(e) {
				this.place = e
				this.show1 = false
			},
			placePick(e) {
				this.show1 = true
			},
			typeEvent(e) {
				this.type = e
				this.show2 = !this.show2
			},
			typePick() {
				this.show2 = true
			},

			//初始化 better-scroll
			_scrollInit() {
				this.menuList = new Bscroll(this.$refs.foodMenu, {
					click: true
				})

				this.foodmenu = new Bscroll(this.$refs.footList, {
					click: true,
					probeType: 3
				})
				this.foodmenu.on('scroll', (pos) => {
					//获取实时滚动的距离 使用scrollY接收         
					this.scrollY = Math.abs(Math.round(pos.y))
				})
			},
			getHeight() {
				//获取每一个li的高度
				const lis = this.$refs.bItem
				//heightList的第一个元素为0
				let height = 0
				this.heightList.push(height)
				//之后的高度即为当前li的高度加上之前面li的高度和
				lis.forEach(item => {
					height += item.clientHeight
					this.heightList.push(height)
				})
			},
			selectLeft(index) {
				let bItem = this.$refs.bItem
				let el = bItem[index]
				this.foodmenu.scrollToElement(el, 1000)
			},
			shelfClick(e, k) {
				console.log(e, ',', k);
			}
		},
		created() {
			//获取页面高度来设置scroll高度
			this.sysHeight = `${document.documentElement.clientHeight}`;
			this.scrollH = `${document.documentElement.clientHeight}` - 190

			this.date = new Date();
			//因为 _scrollInit函数需要操作DOM，因此必须在DOM元素存在文档中才能获取DOM节点
			//因此在 nextTick回调函数里面调用可以是实现此功能
			this.$nextTick(() => {
				this._scrollInit()
				this.getHeight()
			})
		},
		computed: {
			currentIndex() {
				const index = this.heightList.findIndex((item, index) => {
					return this.scrollY >= this.heightList[index] && this.scrollY < this.heightList[index + 1]
				})

				return index > 0 ? index : 0
			}
		}
	}
</script>

<style scoped="">
	#dish {
		background-color: #FFFFFF;
		overflow: hidden;
	}

	.picker {
		justify-content: space-around;
		align-items: center;
		height: 70px;
		background-color: #FFFFFF;
	}

	.btn {
		border-radius: 10px;
	}

	.tables {
		width: 100%;
		border-right: 1px solid #C8C9CC;
		border-bottom: 1px solid #C8C9CC;
	}

	.tables td {
		border-left: 1px solid #C8C9CC;
		border-top: 1px solid #C8C9CC;
	}

	.tables img {
		width: 70px;
		height: 40px;
	}

	.cbox {
		justify-content: center;
	}

	#tabs {
		background-color: #FFFFFF;
		box-sizing: border-box;
	}

	#tabs a {
		color: #323233;
		line-height: 40px;
		width: 25%;
	}

	.foodMenu ul {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		width: 100%;
		border-top: 1px solid #26a2ff;
		border-left: 1px solid #26a2ff;
	}

	.foodMenu li {
		/* box-sizing: border-box; */
		width: 25%;
		line-height: 30px;
		background-color: white;
		color: #26a2ff;
		border-right: 1px solid #26a2ff;
		border-bottom: 1px solid #26a2ff;
	}

	.footList {
		overflow: hidden;
	}

	.active {
		background-color: #26a2ff !important;
		color: white !important;
	}

	.title-content {
		justify-content: space-around;
		line-height: 40px;
		border-bottom: 1px solid #969799;
		box-sizing: border-box;
	}

	.footList p {
		font-size: 10px;
		color: #969799;
		text-align: center;
		width: 100%;
		border-bottom: 1px solid #C8C9CC;
	}
</style>
