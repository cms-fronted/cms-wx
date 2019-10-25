import Vue from 'vue'
import Router from 'vue-router'
import Entry from '@/views/entry'
import Index from '../views/index'
import Ecard from '../views/ecard'
import Dish from '../views/dish'
import Store from '../views/store'
import SelfDish from '../views/selfdish'
import Menu from '../views/menu'
import Order from '../views/order'
import Consume from '../views/consume'
import Recharge from '../views/recharge'
import Note from '../views/note'
import TotalOrder from '../views/totalorder'
import Notice from '../views/notice'
import Setting from '../views/setting'
import PlaceOrder from '../views/selfdish/placeOrder'
import ModifyAddress from '../views/selfdish/modifyAddress'
import NewAddress from '../views/selfdish/newAddress'
import EditAddress from '../views/selfdish/editAddress'
import NoticeEdit from '../views/notice/noticeEdit'
import Selection from '../views/notice/selection'
import OrderingOnline from '../views/orderingOnline'
import SelectCanteen from '../views/selectcanteen'

Vue.use(Router)

export default new Router({
	routes: [{ //进入页面
			path: '/entry',
			name: 'entry',
			component: Entry
		}, { //主页
			path: '/',
			name: 'index',
			component: Index
		}, { //电子饭卡页
			path: '/ecard',
			name: 'ecard',
			component: Ecard
		},
		{ //菜品管理页
			path: '/dish',
			name: 'dish',
			component: Dish
		}, { //小卖部
			path: '/store',
			name: "store",
			component: Store
		}, { //个人选菜
			path: '/selfdish',
			name: 'selfdish',
			component: SelfDish,
		}, { //个人选菜下单
			path: '/placeorder',
			name: 'placeorder',
			component: PlaceOrder
		}, { //个人选菜选择地址
			path: '/modifyaddress',
			name: 'modifyaddress',
			component: ModifyAddress
		}, { //个人选菜新增地址
			path: '/newaddress',
			name: 'newaddress',
			component: NewAddress
		},
		{ //个人选菜修改地址
			path: '/editaddress/:detail',
			name: 'editaddress',
			component: EditAddress
		},
		{ //菜谱查看
			path: '/menu',
			name: 'menu',
			component: Menu
		}, { //订单查询
			path: '/order',
			name: 'order',
			component: Order
		}, { //消费查询
			path: '/consume',
			name: 'consume',
			component: Consume
		}, { //微信充值
			path: '/recharge',
			name: 'recharge',
			component: Recharge
		}, { //通知
			path: '/note',
			name: 'note',
			component: Note
		}, { //设置
			path: '/setting',
			name: 'setting',
			component: Setting
		}, { //总订单查询
			path: '/totalorder',
			name: 'totalorder',
			component: TotalOrder
		}, { //公告发布
			path: '/notice',
			name: 'notice',
			component: Notice
		}, { //公告编辑
			path: '/noticeEdit',
			name: 'noticeEdit',
			component: NoticeEdit
		}, { //公告发布范围选择
			path: '/selection',
			name: 'selection',
			component: Selection
		},
		{ //线上订餐
			path: '/orderingOnline',
			name: 'orderingOnline',
			component: OrderingOnline,
		},
		{//选择饭堂
			path:'/selectcanteen',
			name:'selectcanteen',
			component:SelectCanteen
		}
		// {
		// 	path: '/',
		// 	name: 'home',
		// 	component: Home
		// },
		// {
		// 	path: '/about',
		// 	name: 'about',
		// 	// route level code-splitting
		// 	// this generates a separate chunk (about.[hash].js) for this route
		// 	// which is lazy-loaded when the route is visited.
		// 	component: () => import( /* webpackChunkName: "about" */ './views/About.vue')
		// }
	]
});
