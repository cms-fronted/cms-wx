<template>
  <!-- 总订餐查询 -->
  <div id="totalorder">
    <!-- 选择器 -->
    <div class="flex-row picker shadow">
      <van-button class="btn" type="default" @click="show = true">
        {{$moment(date).format('YYYY-MM-DD')}}
        <van-icon name="arrow-down" />
      </van-button>
    </div>
    <!-- 订餐内容 -->
    <div class="content shadow" v-for="(items,index) in mealTimes" :key="index">
      <p style="text-align: left;line-height: 2px;font-size: 20px;margin-left: 5%;">{{items.name}}</p>
      <div class="flex-row">
        <ul @click="getOrdersAmount(items)">
          <li class="flex-column flex-center">
            <p>订餐数量</p>
            <p>{{items.all}}</p>
          </li>
        </ul>
        <ul @click="dining(items)">
          <li class="flex-column flex-center">
            <p>订餐就餐数量</p>
            <p>{{items.used}}</p>
          </li>
        </ul>
        <ul @click="noOrdering(items)">
          <li class="flex-column flex-center">
            <p>未订餐就餐数量</p>
            <p>{{items.noOrdering}}</p>
          </li>
        </ul>
        <ul @click="noDining(items)">
          <li class="flex-column flex-center">
            <p>订餐未就餐数量</p>
            <p>{{items.orderingNoMeal}}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- 弹出层&时间选择器 -->
    <van-popup v-model="show" position="bottom" style="width: 100%" :style="{ height: '40%' }">
      <van-datetime-picker
        v-model="currentDate"
        @cancel="show = false"
        type="date"
        @confirm="timeEvent"
      />
    </van-popup>
    <!-- 弹出层&订餐数量 -->
    <van-popup class="van-popup" v-model="detail" closeable round :style="{ height: '50%' }">
      <van-list
        v-model="detailLoading"
        :finished="detailFinished"
        finished-text="没有更多了"
        @load="onLoadDetail"
      >
        <p class="popTitle">订餐数量</p>
        <div class="mealAmount">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr style="line-height:30px;">
              <td style="width: 70%;">名称</td>
              <td style="width: 30%;">订餐份数</td>
            </tr>
            <tr style="line-height: 30px;" v-for="(item,index) in menuDetail.list" :key="index">
              <td>{{item.name}}</td>
              <td>{{item.count}}</td>
            </tr>
          </table>
        </div>
      </van-list>
    </van-popup>
    <!-- 弹出器&&订单就餐 -->
    <van-popup class="van-popup" v-model="personDetail" closeable round :style="{ height: '50%' }">
      <van-list
        v-model="personDetailLoading"
        :finished="personDetailFinished"
        @load="onLoadPersonDetail"
      >
        <p class="popTitle">订餐就餐人员明细</p>
        <div class="mealAmount">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr style="line-height:30px;">
              <td style="width: 30%;">名称</td>
              <td style="width: 50%;">手机号码</td>
              <td style="width: 30%;">份数</td>
            </tr>
            <tr style="line-height: 30px;" v-for="(item,index) in personList.list" :key="index">
              <td>{{item.username}}</td>
              <td>{{item.phone}}</td>
              <td>{{item.count}}</td>
            </tr>
          </table>
        </div>
      </van-list>
    </van-popup>
    <!-- 未订餐就餐 -->
    <van-popup class="van-popup" v-model="personDetail1" closeable round :style="{ height: '50%' }">
      <van-list
        v-model="personDetailLoading1"
        :finished="personDetailFinished1"
        @load="onLoadPersonDetail1"
      >
        <p class="popTitle">未订餐就餐人员明细</p>
        <div class="mealAmount">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr style="line-height:30px;">
              <td style="width: 30%;">名称</td>
              <td style="width: 45%;">手机号码</td>
              <td style="width: 30%;">消费次数</td>
            </tr>
            <tr style="line-height: 30px;" v-for="(item,index) in personList.list" :key="index">
              <td>{{item.username}}</td>
              <td>{{item.phone}}</td>
              <td>{{item.count}}</td>
            </tr>
          </table>
        </div>
      </van-list>
    </van-popup>
    <!-- 订餐未就餐 -->
    <van-popup class="van-popup" v-model="personDetail2" closeable round :style="{ height: '50%' }">
      <van-list
        v-model="personDetailLoading2"
        :finished="personDetailFinished2"
        @load="onLoadPersonDetail2"
      >
        <p class="popTitle">订餐未就餐人员明细</p>
        <div class="mealAmount flex-center">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr style="line-height:30px;">
              <td style="width: 30%;">名称</td>
              <td style="width: 50%;">手机号码</td>
              <td style="width: 30%;">份数</td>
            </tr>
            <tr style="line-height: 30px;" v-for="(item,index) in personList.list" :key="index">
              <td>{{item.username}}</td>
              <td>{{item.phone}}</td>
              <td>{{item.count}}</td>
            </tr>
          </table>
          <div style="width: 90%;margin:20px auto;">
            <van-button type="info" size="large" @click="onCharging(personList.dinner_id)">一键扣费</van-button>
          </div>
        </div>
      </van-list>
    </van-popup>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import { mapGetters } from "vuex";
import {
  getOrdersInfo,
  managerDinnerStatistic,
  usersStatistic,
  charging
} from "@/api/totalOrder.js";

export default {
  name: "totalorder",
  data() {
    return {
      detail: false, //popup 订餐数量
      personDetail: false, //popup 订餐就餐人员明细
      personDetail1: false, //popup 未订餐就餐人员明细
      personDetail2: false, //popup 订餐未就餐人员明细
      show: false,
      show1: false,
      date: new Date(), //选择器时间
      currentDate: new Date(),
      mealTimes: [],
      menuDetail: [],
      personList: [],
      paging: {
        //订餐数量分页数据
        total: 0,
        per_page: 6,
        current_page: 1,
        last_page: null
      },
      /*  */
      detailLoading: false, //订餐数量
      detailFinished: false,
      personDetailLoading: false, //订餐就餐
      personDetailFinished: false,
      personDetailLoading1: false, //未订餐就餐
      personDetailFinished1: false,
      personDetailLoading2: false, //订餐未就餐
      personDetailFinished2: false
    };
  },
  methods: {
    async onLoadDetail() {
      if (this.paging.last_page != null) {
        if (this.paging.current_page >= this.paging.last_page) {
          // 数据全部加载完成
          this.detailFinished = true;
        } else {
          this.pagging.current_page += 1;
          const result = await managerDinnerStatistic({
            page: this.paging.current_page,
            size: this.paging.per_page,
            dinner_id: this.menuDetail.dinner_id,
            consumption_time: this.$moment(this.date).format("YYYY-MM-DD")
          });
          if (
            result.errorCode == 0 &&
            result.data.haveFoods == 1 &&
            result.data.statistic
          ) {
            // 设置分页数据
            this.paging.total = result.data.statistic.total;
            this.paging.last_page = result.data.statistic.last_page;
            //初始化页面数据
            this.menuDetail.list = this.menuDetail.list.concat(
              result.data.statistic.data
            );
          }
        }
        this.detailLoading = false;
      }
    },
    async onLoadPersonDetail() {
      if (this.paging.last_page != null) {
        if (this.paging.current_page >= this.paging.last_page) {
          // 数据全部加载完成
          this.personDetail1Finished = true;
        } else {
          this.pagging.current_page += 1;
          const result = await usersStatistic({
            page: this.paging.current_page,
            size: this.paging.per_page,
            dinner_id: this.personList.dinner_id,
            consumption_time: this.$moment(this.date).format("YYYY-MM-DD"),
            consumption_type: "used"
          });
          if (result.errorCode == 0) {
            this.paging.total = result.data.total;
            this.paging.last_page = result.data.last_page;
            this.personList.list = this.personList.list.concat(
              result.data.data
            );
          }
        }
        this.personDetailLoading = false;
      }
    },
    async onLoadPersonDetail1() {
      if (this.paging.last_page != null) {
        if (this.paging.current_page >= this.paging.last_page) {
          // 数据全部加载完成
          this.personDetail1Finished1 = true;
        } else {
          this.pagging.current_page += 1;
          const result = await usersStatistic({
            page: this.paging.current_page,
            size: this.paging.per_page,
            dinner_id: this.personList.dinner_id,
            consumption_time: this.$moment(this.date).format("YYYY-MM-DD"),
            consumption_type: "noOrdering"
          });
          if (result.errorCode == 0) {
            this.paging.total = result.data.total;
            this.paging.last_page = result.data.last_page;
            this.personList.list = this.personList.list.concat(
              result.data.data
            );
          }
        }
        this.personDetailLoading1 = false;
      }
    },
    async onLoadPersonDetail2() {
      if (this.paging.last_page != null) {
        if (this.paging.current_page >= this.paging.last_page) {
          // 数据全部加载完成
          this.personDetail1Finished2 = true;
        } else {
          this.pagging.current_page += 1;
          const result = await usersStatistic({
            page: this.paging.current_page,
            size: this.paging.per_page,
            dinner_id: this.personList.dinner_id,
            consumption_time: this.$moment(this.date).format("YYYY-MM-DD"),
            consumption_type: "orderingNoMeal"
          });
          if (result.errorCode == 0) {
            this.paging.total = result.data.total;
            this.paging.last_page = result.data.last_page;
            this.personList.list = this.personList.list.concat(
              result.data.data
            );
          }
        }
        this.personDetailLoading2 = false;
      }
    },
    /* 
			消费时间选择
			 */
    async timeEvent(e) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.date = e;
      const result = await getOrdersInfo({
        canteen_id: this.canteenIdGetters,
        consumption_time: this.$moment(this.date).format("YYYY-MM-DD")
      });
      if (result.errorCode == 0) {
        this.mealTimes = result.data;
      }
      this.show = false;
      Toast.clear();
    },
    placeEvent(e) {
      this.place = e;
      this.show1 = false;
    },
    /* 
			点击订餐数量
			 */
    async getOrdersAmount(data) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      if (data.all == 0) {
        Toast.fail("暂无数据");
        return;
      }
      const result = await managerDinnerStatistic({
        page: this.paging.current_page,
        size: this.paging.per_page,
        dinner_id: data.id,
        consumption_time: this.$moment(this.date).format("YYYY-MM-DD")
      });
      //有选菜返回
      if (
        result.errorCode == 0 &&
        result.data.haveFoods == 1 &&
        result.data.statistic
      ) {
        // 设置分页数据
        this.paging.total = result.data.statistic.total;
        this.paging.last_page = result.data.statistic.last_page;
        //初始化页面数据
        this.menuDetail = {
          dinner_id: data.id,
          list: result.data.statistic.data
        };
        this.detail = true;
      } else if (result.errorCode == 0 && result.data.haveFoods == 2) {
        Toast.fail({
          message: "无选菜类型，暂无数据！",
          duration: 1500
        });
      }
      setTimeout(() => {
        Toast.clear();
      }, 1000);
    },
    /* 
			订餐就餐人员明细
			 */
    async dining(data) {
      if (data.used == 0) {
        Toast.fail("暂无数据！");
        return;
      }
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //展示订餐就餐人员明细
      const result = await usersStatistic({
        page: this.paging.current_page,
        size: this.paging.per_page,
        dinner_id: data.id,
        consumption_time: this.$moment(this.date).format("YYYY-MM-DD"),
        consumption_type: "used"
      });
      if (result.errorCode == 0) {
        this.paging.total = result.data.total;
        this.paging.last_page = result.data.last_page;
        this.personList = {
          dinner_id: data.id,
          list: result.data.data
        };
      }
      setTimeout(() => {
        Toast.clear();
      }, 1000);
      this.personDetail = true;
    },
    /* 
				未订餐就餐人员明细
			 */
    async noOrdering(data) {
      if (data.noOrdering == 0) {
        Toast.fail("暂无数据！");
        return;
      }
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //展示订餐就餐人员明细
      const result = await usersStatistic({
        page: this.paging.current_page,
        size: this.paging.per_page,
        dinner_id: data.id,
        consumption_time: this.$moment(this.date).format("YYYY-MM-DD"),
        consumption_type: "noOrdering"
      });
      if (result.errorCode == 0) {
        this.paging.total = result.data.total;
        this.paging.last_page = result.data.last_page;
        this.personList = {
          dinner_id: data.id,
          list: result.data.data
        };
      }
      setTimeout(() => {
        Toast.clear();
      }, 1000);
      this.personDetail1 = true;
    },
    /* 
			 订餐未就餐人员明细
			 */
    async noDining(data) {
      if (data.orderingNoMeal == 0) {
        Toast.fail("暂无数据！");
        return;
      }
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //展示订餐就餐人员明细
      const result = await usersStatistic({
        page: this.paging.current_page,
        size: this.paging.per_page,
        dinner_id: data.id,
        consumption_time: this.$moment(this.date).format("YYYY-MM-DD"),
        consumption_type: "orderingNoMeal"
      });
      if (result.errorCode == 0) {
        this.paging.total = result.data.total;
        this.paging.last_page = result.data.last_page;
        this.personList = {
          dinner_id: data.id,
          list: result.data.data
        };
      }
      setTimeout(() => {
        Toast.clear();
      }, 1000);
      this.personDetail2 = true;
    },
    /* 
				一键扣费
			 */
    async onCharging(data) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      const result = await charging({
        consumption_time: this.$moment(this.date).format("YYYY-MM-DD"),
        dinner_id: data
      });
      Toast.clear();
      if (result.errorCode == 0) {
        Toast.success("扣费成功！");
        this.personDetail2 = false;
      }
    },
    /* 清空分页信息 */
    clearPaging() {
      this.paging = {
        total: 0,
        per_page: 6,
        current_page: 1,
        last_page: null
      };
    }
  },
  async created() {
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0
    });
    // Dialog.alert({
    // 	message: '就餐时间未结束，不能进行一键扣费操作，请在13:30（消费策略时间）后进行操作'
    // });
    /* 初始化数据 */
    const result = await getOrdersInfo({
      canteen_id: this.canteenIdGetters,
      consumption_time: this.$moment(this.date).format("YYYY-MM-DD")
    });
    if (result.errorCode == 0) {
      this.mealTimes = result.data;
    }
    Toast.clear();
  },
  computed: {
    ...mapGetters("user", {
      canteenIdGetters: "canteenIdGetters"
    })
  },
  watch: {
    detail(newVal) {
      console.log(1, newVal);
      if (newVal == false) {
        this.clearPaging();
      }
    },
    personDetail(newVal) {
      console.log(1, newVal);
      if (newVal == false) {
        this.clearPaging();
      }
    },
    personDetail1(newVal) {
      console.log(1, newVal);
      if (newVal == false) {
        this.clearPaging();
      }
    },
    personDetail2(newVal) {
      console.log(3, newVal);
      console.log(1, newVal);
      if (newVal == false) {
        this.clearPaging();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#totalorder {
  width: 100%;
}

.van-popup {
  width: 90%;
}

#totalorder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.content {
  width: 95%;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.shadow div {
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
}

.shadow ul {
  justify-content: space-around;
  width: 45%;
  box-shadow: 5px 5px 10px 0px #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
}

.shadow ul li {
  height: 80px;
  line-height: 0px;
  height: 70px;
  font-size: 16px;
}

.shadow ul li:active {
  box-shadow: 0px 0px 10px #ccc;
}

.picker {
  // justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 70px;
}

.mealAmount {
  width: 100%;
  height: 300px;
  overflow: scroll;
}

.mealAmount td {
  border-left: 1px solid #c8c9cc;
  border-top: 1px solid #c8c9cc;
}

.mealAmount table {
  width: 90%;
  margin: 0 5%;
  text-align: center;
  border-right: 1px solid #c8c9cc;
  border-bottom: 1px solid #c8c9cc;
}

.popTitle {
  font-size: 24px;
  line-height: 10px;
}

.btn {
  border-radius: 10px;
  margin-left: 40px;
}
</style>
