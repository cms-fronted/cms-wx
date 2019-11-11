<template>
  <!-- 线上订餐 -->
  <div>
    <div class="flex-row" style="align-items: center;justify-content: space-around;margin: 20px 0;">
      <van-button class="myBtn" @click="timeShow = true">
        {{$moment(currentDate).format("YYYY-MM")}}
        <div class="mIcon" />
      </van-button>
      <p>订餐数量：8</p>
    </div>
    <table width="100%" ref="tableForm">
      <tr>
        <th>日期</th>
        <th
          v-for="(item,index) in mealList"
          :data-d_id="item.id"
          :data-type="item.type"
          :data-type_number="item.type_number"
          :data-time="item.limit_time"
          :data-count="item.ordered_count"
          :key="index"
        >{{item.name}}</th>
      </tr>
      <tr>
        <td>全选</td>
        <td v-for="(item,index) in mealList" :data-d_id="item.id" :key="index">全{{item.name}}</td>
        <!-- <td>全午</td>
        <td>全晚</td>-->
      </tr>
      <tr v-for="(item,index) in tableData" :key="index">
        <td>{{item.date}}</td>
        <td
          v-for="(order, orderIndex) in item.orderOfMeal"
          @touchstart="(e)=>gotouchstart(e,item)"
          @touchmove="gotouchmove"
          @touchend="(e)=>gotouchend(e,item)"
          :key="orderIndex"
        >
          <p
            v-for="canteen in order.canteens"
            :key="canteen.canteen_id"
          >{{canteen.canteen}}*{{canteen.count}}</p>
        </td>
      </tr>
    </table>
    <van-popup v-model="timeShow" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        :min-date="minDate"
        @cancel="timeShow = false"
        @confirm="timeConf"
      />
    </van-popup>
    <van-dialog
      v-model="editShow"
      title="修改数量"
      :before-close="(action,done)=>confirmEdit(action,done)"
      :show-cancel-button="true"
    >
      <van-stepper
        style="padding:10px 0"
        input-width="40px"
        button-size="32px"
        v-model="nowCount"
        min="1"
        :max="maxCount"
      />
    </van-dialog>
    <van-dialog
      v-model="addShow"
      title="订餐数量"
      :before-close="(action,done)=>confirmAdd(action,done)"
      :show-cancel-button="true"
    >
      <van-stepper
        style="padding:10px 0"
        input-width="40px"
        button-size="32px"
        v-model="addCount"
        min="1"
        :max="maxCount"
      />
    </van-dialog>
  </div>
</template>

<script>
import request from "../../utils/request";
import { getOrderDetail, getUserOrder } from "@/api/orderingOnline";
import moment from "moment";
import { Dialog, Stepper } from "vant";
import { async } from "q";
import QS from "qs";
import { constants } from "buffer";

export default {
  data() {
    return {
      timeShow: false,
      editShow: false,
      addShow: false,
      currentDate: new Date(),
      minDate: new Date(),
      timeOutEvent: null,
      maxCount: "", //编辑时最大订餐数量
      nowCount: "", //编辑时订餐数量
      nowId: "", //编辑时订餐id
      dinner_id: "", //下单时餐次id
      addCount: "", //下单时订餐数量
      ordering_date: "", //下单时点击单元格对应的时间
      dateList: [],
      orderDataList: [],
      // 饭餐类型
      mealList: [],
      // 饭堂列表
      canteenList: [],
      // 订单列表
      orderList: []
    };
  },
  computed: {
    tableData() {
      let dateList = this.dateList,
        mealList = this.mealList,
        orderList = this.orderList;
      return dateList.map((date, index) => {
        if (!orderList) return;
        return {
          date: date,
          orderOfMeal: mealList.map(meal => {
            return orderList[index][meal.name];
          })
        };
      });
    }
  },
  async mounted() {
    let res1 = await getOrderDetail();
    let res2 = await request({
      url: "/v1/order/userOrdering",
      method: "get",
      params: {
        consumption_time: moment().format("YYYY-MM")
      }
    });
    this.computeDate();
    this.mealList = res1.data; //数据的 渲染必须同步， 同时生成mealList，orderList
    this.orderList = this.computeOrderList(
      res2.data.filter(item => item.ordering_type === "online")
    );
    this.$bus.$on("update", () => {
      setTimeout(async () => {
        await this.selectCanteen();
      }, 2000);
    });
  },
  methods: {
    computeDate() {
      //首次载入时， 创建当月剩余天数日期数组
      let format = "YYYY-MM-DD",
        today = moment().format(format),
        dates = [],
        date = moment();
      while (date.isSame(today, "month")) {
        dates.push(date.format(format));
        date.add(1, "days");
      }
      this.dateList = dates;
    },
    computeOrderList(data) {
      let mealList = this.mealList;
      return this.dateList.map(date => {
        let order = {};
        mealList.forEach(meal => {
          // 这个对象的键名根据dinner的中文名还是id，根据实际改变
          order[meal.name] = {
            total: 0,
            canteens: []
          };
        });
        for (let i = data.length - 1; i >= 0; i--) {
          let {
            ordering_date,
            canteen,
            d_id,
            c_id,
            count,
            dinner,
            id,
            create_time
          } = data[i];
          // 订餐数据条目不为今日则跳过这一条
          if (date !== ordering_date) continue;
          // 如果 餐次信息与当前饭堂餐次信息不匹配则跳过这一条
          if (!order[dinner]) continue;
          // 这个根据dinner的中文名还是id，根据实际改变
          order[dinner].total += count;
          let canteenIndex = order[dinner].canteens.findIndex(
            canteen => canteen.canteen_id === order.c_id
          );
          if (canteenIndex === -1) {
            order[dinner].id = id;
            order[dinner].canteens.push({
              canteen: canteen,
              canteen_id: c_id,
              d_id: d_id,
              count: count,
              create_time: create_time
            });
          } else {
            order[dinner].canteens[canteenIndex].count += count;
          }
          data.splice(i, 1);
        }console.log(order);
        return order;
      });
    },
    async selectCanteen() {
      let date = this.currentDate;
      let res1 = await getOrderDetail();
      let res2 = await request({
        url: "/v1/order/userOrdering",
        method: "get",
        params: {
          consumption_time: moment(date).format("YYYY-MM")
        }
      });
      this.initDate(date);
      this.mealList = res1.data;
      this.orderList = this.computeOrderList(
        res2.data.filter(item => item.ordering_type === "online")
      );
    },
    async timeConf(e) {
      this.currentDate = e || new Date();
      this.timeShow = false;
      this.dateList = [];
      this.orderList = [];
      // await this.getUserOrdered(e);
      const consumption_time = this.$moment(e).format("YYYY-MM");
      const res = await getUserOrder({
        consumption_time
      });
      this.initDate(e);
      this.orderList = this.computeOrderList(
        res.data.filter(item => item.ordering_type === "online")
      );
    },
    //初始化事件数组
    initDate(date) {
      //默认清空日期数据
      let dates = [];
      let year = this.$moment(date).year();
      let chooseMonth = date.getMonth() + 1; //保存选中的月份
      let nowMonth = new Date().getMonth() + 1; // 保存当前月份
      let isCurrentMonth = chooseMonth === nowMonth; // 判断所选中的月份是否为当前月份
      let startD, endD, restDay, _date;
      if (isCurrentMonth) {
        //如果为当前月份， 日期开始时间为今日，否则为1号
        startD = this.$moment().date();
      }
      startD = isCurrentMonth
        ? this.$moment().date()
        : this.$moment(date).date();
      endD = this.$moment(date)
        .endOf("month")
        .format("DD");
      endD = Number(endD);
      // restDay = endD - startD;
      for (let i = startD; i < endD + 1; i++) {
        // 循环插入每一天的数据
        _date = "" + year + "-" + chooseMonth + "-" + i;
        dates.push(_date);
      }
      this.dateList = dates;
    },
    async getOrderingDetail() {
      //获取餐次配置信息， 切换饭堂后，需延迟2000ms再获取，否则为上一饭堂的配置信息
      const res = await getOrderDetail();
      if (res.msg === "ok") {
        this.mealList = Array.from(res.data);
      }
    },
    async getUserOrdered(e) {
      //获取用户 选取月份的订单信息
      const consumption_time = e
        ? this.$moment(e).format("YYYY-MM")
        : this.$moment().format("YYYY-MM");
      const res = await getUserOrder({
        consumption_time
      });
      if (res.msg === "ok") {
        const data = res.data;
        this.orderList = this.computeOrderList(
          data.filter(item => item.ordering_type === "online")
        );
      }
    },
    gotouchstart(e, row) {
      //e.target.parentNode.cellIndex对应点击的单元格位置
      //e.target.parentNode.cellIndex + 1 对应对象中第几个点餐数据
      let that = this;
      let cellIndex, dataset, d_id, count, id;
      clearTimeout(this.timeOutEvent); //清除定时器
      if (e.target.tagName === "P") {
        //如果已经订餐 走这里面的流程
        dataset = this.$refs.tableForm.rows[0].cells[
          e.target.parentNode.cellIndex
        ].dataset;
        cellIndex = e.target.parentNode.cellIndex;
        id = row.orderOfMeal[cellIndex - 1].id;
        console.log(row);
        //执行长按事件，取消订餐

        this.timeOutEvent = setTimeout(function() {
          //执行长按要执行的内容，
          that.timeOutEvent = 0;
          Dialog.confirm({
            message: "是否取消该餐次订单，取消后无法撤回",
            beforeClose
          });
        }, 700); //这里设置定时
        return false;
        async function beforeClose(action, done) {
          const data = { id: id };
          if (action === "confirm") {
            const res = await request({
              url: "/v1/order/cancel",
              method: "post",
              data: QS.stringify(data)
            });
            if (res.msg === "ok") {
              done();
              Dialog({ message: "操作成功！" }).then(async () => {
                Dialog.close();
                await that.getUserOrdered();
              });
            } else {
              setTimeout(() => {
                done();
              }, 700);
            }
          } else {
            done();
          }
        }
      } else {
        // if (!this.$refs.tableForm.rows[0].cells[e.target.cellIndex]) return;
        // dataset = this.$refs.tableForm.rows[0].cells[e.target.cellIndex]
        //   .dataset;
        // d_id = dataset.d_id;
        // count = dataset.count;
        // cellIndex = e.target.parentNode.cellIndex;
      }
    },
    async confirmEdit(action, done) {
      const data = {
        id: this.nowId,
        count: this.nowCount
      };
      if (action === "confirm") {
        const res = await request({
          url: "/v1/order/changeCount",
          method: "post",
          data: QS.stringify(data)
        });
        if (res.msg === "ok") {
          done();
          Dialog({ message: "操作成功！" }).then(async () => {
            Dialog.close();
          });
          await this.getUserOrdered();
        } else {
          done();
        }
      } else {
        done();
      }
    },
    async confirmAdd(action, done) {
      if (action === "confirm") {
        let d_id = this.dinner_id;
        let count = this.addCount;
        let ordering_date = this.ordering_date;
        let detail = [
          {
            d_id: d_id,
            ordering: [
              {
                ordering_date,
                count
              }
            ]
          }
        ];
        detail = JSON.stringify(detail);
        const data = { detail };
        const res = await request({
          url: "/v1/order/online/save",
          method: "post",
          data: QS.stringify(data)
        });
        if (res.msg === "ok") {
          done();
          Dialog({ message: "操作成功！" }).then(async () => {
            Dialog.close();
          });
          await this.getUserOrdered();
        } else {
          done();
        }
      } else {
        done();
      }
    },
    //手释放，如果在1000毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gotouchend(e, row) {
      clearTimeout(this.timeOutEvent);
      let cellIndex, dataset, d_id, count, id;
      if (this.timeOutEvent != 0) {
        //这里写要执行的内容（尤如onclick事件）
        if (e.target.tagName === "P") {
          //如果已经订餐 走这里面的流程
          dataset = this.$refs.tableForm.rows[0].cells[
            e.target.parentNode.cellIndex
          ].dataset;
          this.editShow = true;
          cellIndex = e.target.parentNode.cellIndex;
          id = row.orderOfMeal[cellIndex - 1].id;
          this.nowId = id; //保存 订单id 供修改使用
          d_id = dataset.d_id;
          this.nowCount = row.orderOfMeal[cellIndex - 1].canteens[0].count; //当前订单数量
          this.maxCount = dataset.count; //限制最大订餐数量
        } else {
          //如果未订餐， 走这里面的流程
          dataset = this.$refs.tableForm.rows[0].cells[e.target.cellIndex]
            .dataset;
          let { type, type_number, time } = dataset;
          const order_date = row.date; //选中的 订餐日期
          const hour = moment(time, "HH:mm:ss").get("hour");
          const minute = moment(time, "HH:mm:ss").get("minute");
          const now = moment();
          const today = moment().format("YYYY-MM-DD");
          const date = moment(); //创建 今日时间戳
          if (type === "day") {
            date.set("hour", hour);
            date.set("minute", minute);
            date.add(type_number, type); //  加上需提前的天数
            if (!moment(order_date).isAfter(date)) {
              // 如果选中 订餐日期 符合 提前天数
              Dialog({ message: "已超过订餐截止时间" }).then(() => {
                Dialog.close();
              });
              return false;
            }
          } else if (type === "week") {
            const prevDate = moment(order_date).day(-type_number); //选中日期 提前 一周的周 几，根据实际情况
            prevDate.set("hour", hour);
            prevDate.set("minute", minute);
            if (!moment(now).isBefore(prevDate)) {
              Dialog({ message: "已超过订餐截止时间" }).then(() => {
                Dialog.close();
              });
              return false;
            } // 是否有提前
          }
          this.ordering_date = row.date;
          this.dinner_id = dataset.d_id;
          this.maxCount = dataset.count;
          this.addShow = true;
        }
      }
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gotouchmove() {
      clearTimeout(this.timeOutEvent); //清除定时器
      this.timeOutEvent = 0;
    }
  }
};
</script>

<style scoped>
table tr,
th,
td {
  border: 0.5px solid;
  height: 50px;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
