<template>
  <!-- 订单查询 -->
  <div>
    <!-- 顶部筛选框 -->
    <div class="shadow picker">
      <van-button
        class="btn"
        type="default"
        :disabled="typeList.length == 0"
        @click="typePicker = true;"
      >
        {{type | typeFilter}}
        <van-icon name="arrow-down" />
      </van-button>
      <van-button
        class="btn"
        type="default"
        :disabled="addressList.length == 0"
        @click="addressPicker = true;"
      >
        {{address}}
        <van-icon name="arrow-down" />
      </van-button>
    </div>
    <!-- 列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="onLoad"
    >
      <div class="flex-row flex-center" style="width: 100%;margin-top: 20px;">
        <table style="width: 95%;" border="1" cellpadding="0" cellspacing="0">
          <tr style="height: 60px;background-color: #26A2FF;">
            <td width="10%">序号</td>
            <td>地点</td>
            <td>类型</td>
            <td width="30%">日期</td>
            <td>名称</td>
            <td width="20%">金额（元）</td>
          </tr>
          <tr v-for="(item,index) in list" :key="index" height="80px" @click="showOrder(item)">
            <td>{{index+1}}</td>
            <td>{{item.address}}</td>
            <td>{{item.type}}</td>
            <td>{{item.create_time}}</td>
            <td>{{item.dinner}}</td>
            <td>{{item.money}}</td>
          </tr>
        </table>
      </div>
    </van-list>

    <van-divider
      v-if="list.length==0"
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >暂无数据</van-divider>

    <!-- 弹窗&&选择器 -->
    <van-popup v-model="addressPicker" :close-on-click-overlay="false" position="bottom">
      <van-picker
        :columns="addressList"
        show-toolbar
        value-key="name"
        @cancel="addressPicker = false"
        @confirm="addressConf"
      />
    </van-popup>
    <van-popup v-model="typePicker" :close-on-click-overlay="false" position="bottom">
      <van-picker
        :columns="typeList"
        show-toolbar
        value-key="name"
        @cancel="typePicker = false"
        @confirm="typeConf"
      />
    </van-popup>
    <!-- 订单详情弹窗 -->
    <van-popup
      class="flex-column flex-center"
      v-model="detailShow"
      :closeable="true"
      :close-on-click-overlay="false"
      @close="closeDetail"
      style="width: 90%;padding-bottom: 20px;"
    >
      <p
        style="border-bottom: 1px solid #CCCCCC;width: 100%;font-size: 14px;width: 100%;margin: 0;padding: 10px 0;"
      >{{orderDetail.dinner}}</p>
      <!-- <p v-if="type == 3" style="border-bottom: 1px solid #CCCCCC;width: 100%;font-size: 14px;width: 100%;margin: 0;padding: 10px 0;">商品</p> -->
      <div class="flex-column flex-center" style="width: 95%;">
        <div v-if="type!=3" class="flex-row" style="justify-content: space-between;width: 80%;">
          <p>份数：</p>
          <p style="color: #EE0A24;">{{this.orderDetail.count}}份</p>
        </div>
        <table
          style="width: 95%;"
          border="1"
          cellpadding="0"
          cellspacing="0"
          v-if="ordering_type == 'personal_choice' && !orderDetail.foods"
        >
          <tr>
            <td>名称</td>
            <td>单位</td>
            <td>数量</td>
            <td>金额（元）</td>
          </tr>
          <tr v-for="(item,index) in orderDetail.foods" :key="index">
            <td>{{item.name}}</td>
            <td>{{item.unit}}</td>
            <td>{{item.count}}</td>
            <td>{{item.count * parseFloat(item.price)}}（元）</td>
          </tr>
          <tr>
            <td>合计</td>
            <td></td>
            <td>{{detailCount}}</td>
            <td>{{detailAmount}}(元)</td>
          </tr>
        </table>
        <div style="font-size: 14px;width: 95%;margin: 10px;">
          <div v-if="orderDetail.address" style="border:1px solid #F2F3F5;">
            <p style="border-bottom:1px solid #F2F3F5;margin: 0;padding: 10px 0;">送餐地址</p>
            <p style="text-align: left;padding-left: 10px;">{{orderDetail.address.address}}</p>
            <p style="text-align:left;color: #D7D7D7;font-size: 12px;padding-left: 10px;">
              {{orderDetail.address.name}}
              {{orderDetail.address.phone}}
            </p>
          </div>
          <div
            class="flex-row"
            style="justify-content: space-around;margin-top: 10px;flex-wrap: wrap;"
          >
            <van-button type="info" :disabled="orderDetail.used ==1" @click="cancleOrder">取消订单</van-button>
            <van-button type="info" :disabled="orderDetail.used ==1" @click="editOrder">修改订单</van-button>
            <van-button
              v-if="orderDetail.address"
              type="info"
              :disabled="orderDetail.used ==1"
              @click="editAddress"
            >修改地址</van-button>
            <van-button
              v-if="type==3&&orderDetail.order_type==1"
              :disabled="hadCode"
              type="info"
              @click="getCode"
            >获取提货码</van-button>
          </div>
          <div v-if="shopCode" class="flex-column flex-center" style="margin:auto;">
            <p>已绑定，扫描二维码即可消费</p>
            <img :src="shopCode" style="width: 60%;margin-bottom: 20px;" />
            <span>生成日期：{{sTime}}</span>
            <span>失效日期：{{eTime}}</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { canChooseCant } from "@/api/user.js";
import {
  userOrderings,
  getOrderDetail,
  cancelOrder,
  deliveryCode,
  cancelSelfOrder
} from "@/api/order.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      type: 0, // 类型：1|就餐；2|外卖；3|小卖部
      addressId: null, //饭堂id 或企业id
      address: "请选择地点", //地点
      addressList: [], //地点列表
      typeList: [
        {
          id: 1,
          name: "就餐"
        },
        {
          id: 2,
          name: "外卖"
        },
        {
          id: 3,
          name: "小卖部"
        }
      ],
      typePicker: false, //类型选择器
      addressPicker: false, //地点选择器
      list: [],
      detailShow: false, //订单详情展示
      orderDetail: {}, //订单详情信息
      sTime: "", //二维码开始时间
      eTime: "", //二维码结束时间
      place: [], //用户可选地址
      orderDetailCount: {}, //订单总数查询
      shopCode: "", //小卖部提货码
      total: null, //订单总数
      current_page: 1,
      per_page: 10,
      last_page: 0,
      loading: false,
      finished: false
    };
  },
  methods: {
    /* 下拉加载 */
    async onLoad() {
      // setTimeout(async () => {
      if (this.current_page < this.last_page) {
        this.current_page += 1;
        const result = await userOrderings({
          page: this.current_page,
          size: this.per_page,
          type: this.type,
          id: this.addressId
        });
        if (result.errorCode == 0) {
          this.list = this.list.concat(result.data.data);
          this.total = result.data.total;
          this.last_page = result.data.last_page;
          this.current_page = result.data.current_page;
        }
      }
      this.loading = false;
      console.log(this.current_page, this.last_page, this.total == 0);
      if (this.current_page == this.last_page || this.total == 0) {
        this.finished = true;
      }
      // }, 1000);
    },
    //选择器确认按钮
    typeConf(e) {
      this.type = e.id;
      this.address = "请选择地点";
      this.typePicker = false;
      this.current_page = 1;
      this.last_page = 0;
      this.list = [];
      this.finished = false;
      this.$dialog.confirm({
        title: "提示",
        message: "请选择地点进行查询",
        "close-on-click-overlay": true
      });
    },
    //确认并获取订单列表
    async addressConf(e) {
      console.log(e);
      Toast.loading({
        message: "获取订单信息中...",
        forbidClick: true
      });
      if (this.type == 3) {
        this.place.forEach((items, index) => {
          if (items.company.name == e.name) {
            this.addressId = items.company_id;
          }
        });
      } else if (this.type == 1 || this.type == 2) {
        this.place.forEach((items, index) => {
          items.canteens.forEach((item, key) => {
            if (item.info.name == e.name) {
              this.addressId = item.canteen_id;
            }
          });
        });
      }
      this.address = e.name;
      this.addressPicker = false;
      this.current_page = 1;
      this.last_page = 0;
      this.list = [];
      this.finished = false;
      //调用获取订单列表接口
      const data = {
        page: this.current_page,
        size: this.per_page,
        type: this.type,
        id: this.addressId
      };
      const result = await userOrderings(data);
      if (result.errorCode == 0) {
        this.list = result.data.data;
        this.total = result.data.total;
        this.last_page = result.data.last_page;
        this.current_page = result.data.current_page;
      }
      Toast.clear();
    },
    // 取消订单
    cancleOrder() {
      this.$dialog
        .confirm({
          title: "取消订单",
          message: "确认取消该订单吗?"
        })
        .then(async () => {
          Toast.loading({
            forbidClick: true,
            duration: 0
          });
          // on confirm
          if (this.type == 3) {
            //调用取消订单接口
            const result = await cancelOrder({
              id: this.orderDetail.id
            });
            if (result.errorCode == 0) {
              this.detailShow = false;
              Toast.success("取消成功！");
            }
          } else {
            const result = await cancelSelfOrder({
              id: this.orderDetail.id
            });
            if (result.errorCode == 0) {
              this.detailShow = false;
              Toast.success("取消成功！");
            }
          }

          //初始化订单列表
          const result2 = await userOrderings({
            page: this.current_page,
            size: this.per_page,
            type: this.type,
            id: this.addressId
          });
          if (result2.errorCode == 0) {
            this.list = result2.data.data;
            this.total = result2.data.total;
            this.last_page = result2.data.last_page;
            this.current_page = result2.data.current_page;
          }

          Toast.clear();
        })
        .catch(() => {
          // on cancel
          console.log("取消");
        });
    },
    // 显示订单详情
    async showOrder(e) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //调用获取订单的详情
      const result = await getOrderDetail({
        type: this.type,
        id: e.id
      });
      if (result.errorCode == 0) {
        this.orderDetail = Object.assign(result.data, {
          dinner: e.dinner
        });
        this.detailShow = true;
      } else {
        this.detailShow = false;
      }
      Toast.clear();
    },
    /* 获取提货码 */
    async getCode() {
      Toast.loading({
        message: "获取中...",
        forbidClick: true,
        duration: 0
      });
      const result2 = await deliveryCode({
        id: this.orderDetail.id
      });
      if (result2.errorCode == 0) {
        this.sTime = result2.data.url.time_begin;
        this.eTime = result2.data.url.time_end;
        this.shopCode = "http://canteen.tonglingok.com/" + result2.data.url.url;
      }
      Toast.clear();
    },
    /* 关闭订单详情 */
    closeDetail() {
      this.orderDetail = {};
      this.shopCode = "";
    },
    //修改订单
    editOrder() {
      if (this.orderDetail.used == 1) {
        this.$dialog.alert({
          message: "该订单无法修改"
        });
      } else {
        //跳转至订单修改
        this.$router.push({
          name: "editselforder",
          params: {
            canteen_id: this.orderDetail.canteen_id,
            dinner_id: this.orderDetail.dinner_id,
            ordering_date: this.orderDetail.ordering_date,
            orderDetail: this.orderDetail
          }
        });
      }
    },
    //修改地址
    editAddress() {
      if (this.orderDetail.used == 1) {
        this.$dialog.alert({
          message: "该订单无法修改"
        });
      } else {
        //跳转至地址修改
        this.$router.push({
          name: "placeorder",
          params: {
            orderDetail: this.orderDetail,
            orderType: 4
          }
        });
      }
    }
  },
  filters: {
    typeFilter(type) {
      if (type == 1) {
        return "就餐";
      } else if (type == 2) {
        return "外卖";
      } else if (type == 3) {
        return "小卖部";
      }
      return "请选择类型";
    }
  },
  watch: {
    type(e) {
      if (e == 3) {
        //初始化地点选项
        this.addressList = [];
        this.place.forEach((item, index) => {
          this.addressList[index] = {
            name: this.place[index].company.name,
            id: this.place[index].company.id
          };
        });
      } else {
        //初始化地点选项
        this.addressList = [];
        this.place.forEach((items, index) => {
          items.canteens.forEach((item, key) => {
            this.addressList[key] = {
              name: item.info.name,
              id: item.info.id
            };
          });
        });
      }
    }
  },
  computed: {
    detailCount() {
      var sum = 0;
      if (this.orderDetail.foods) {
        this.orderDetail.foods.forEach((item, index) => {
          sum = sum + item.count;
        });
      }
      return sum;
    },
    detailAmount() {
      var sum = 0;
      if (this.orderDetail.foods) {
        this.orderDetail.foods.forEach((item, index) => {
          sum = parseFloat(item.price) * item.count + sum;
        });
      }
      return sum;
    },
    hadCode() {
      if (this.shopCode != "") {
        return true;
      }
      return false;
    }
  },
  async created() {
    Toast.loading({
      duration: 0,
      forbidClick: true
    });
    //调用用户可进入饭堂接口获取地点数据
    const result = await canChooseCant();
    console.log("结果", result);
    if (result.errorCode == 0) {
      this.place = result.data;
    }
    this.type = 1;
    if (this.type == 3) {
      this.addressId = this.place[0].company.id;
      this.address = this.place[0].company.name;
      this.place.forEach((item, index) => {
        this.addressList[index] = this.place[index].company.name;
      });
    } else if (this.type == 1 || this.type == 2) {
      this.addressId = this.place[0].canteens[0].info.id;
      this.address = this.place[0].canteens[0].info.name;
      this.place.forEach((items, index) => {
        items.canteens.forEach((item, key) => {
          this.addressList[key] = item.info.name;
        });
      });
    }
    //初始化订单列表
    const result2 = await userOrderings({
      page: this.current_page,
      size: this.per_page,
      type: this.type,
      id: this.addressId
    });
    if (result2.errorCode == 0) {
      this.list = result2.data.data;
      this.total = result2.data.total;
      this.last_page = result2.data.last_page;
      this.current_page = result2.data.current_page;
    }
    Toast.clear();
  }
};
</script>

<style lang="scss" scoped>
.picker {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .btn {
    width: 40%;
    border-radius: 10px;
    margin: 10px 5%;
  }
}

p {
  margin: 10px 0;
}
</style>
