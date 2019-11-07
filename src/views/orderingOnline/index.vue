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
        <th v-for="(item,index) in mealList" :data-id="item.id" :key="index">{{item.name}}</th>
      </tr>
      <tr>
        <td>全选</td>
        <td v-for="(item,index) in mealList" :data-id="item.id" :key="index">全{{item.name}}</td>
        <!-- <td>全午</td>
        <td>全晚</td>-->
      </tr>
      <tr v-for="(item,index) in dateList" :key="index" @click="(e)=>openOrderDialog(item,e)">
        <td>
          <span>{{item.date}}</span>
        </td>
        <td v-for="(i,key) in mealList" :key="key">{{item.canteen}}</td>
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
  </div>
</template>

<script>
import { getOrderDetail, getUserOrder } from "@/api/orderingOnline";
export default {
  data() {
    return {
      timeShow: false,
      currentDate: new Date(),
      minDate: new Date(),
      mealList: [
        {
          id: 7,
          name: "早餐"
        },
        {
          id: 6,
          name: "中餐"
        },
        {
          id: 8,
          name: "晚餐"
        }
      ],
      dateList: [],
      orderDataList: []
    };
  },
  methods: {
    async timeConf(e) {
      this.currentDate = e;
      this.timeShow = false;
      const consumption_time = this.$moment(e).format("YYYY-MM");
      this.initDate(e);
      await this.getUserOrdered(consumption_time);
    },
    initDate(date) {
      this.dateList = []; //默认清空日期数据
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
        this.dateList.push({
          date: _date
        });
      }
    },
    openOrderDialog(row, e) {
      if (!this.$refs.tableForm.rows[0].cells[e.target.cellIndex]) return;
      this.matchOrderToData();
    },
    async getOrderingDetail() {
      const res = await getOrderDetail();
      if (res.msg === "ok") {
        this.mealList = Array.from(res.data);
      }
    },
    async getUserOrdered(e) {
      const res = await getUserOrder({
        consumption_time: e
      });
      if (res.msg === "ok") {
        const data = res.data;
        this.orderDataList = data.filter(
          item => item.ordering_type === "online"
        );
      }
    },
    matchOrderToData() {
      let objDate = this.dateList;
			let objOrder = this.orderDataList;
			console.log(objOrder);
      console.log(this.fireDuplicate(objOrder));

      // objDate = Object.assign({}, objDate, objOrder);
      // this.dateList = objDate;
    },
    fireDuplicate(arr) {
      var map = {},
        dest = [];
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        if (!map[ai.id]) {
          dest.push({
            id: ai.id,
            ordering_date: ai.ordering_date,
            d_id: ai.d_id,
            data: [ai]
          });
          map[ai.id] = ai;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.id == ai.id) {
              dj.data.push(ai);
              break;
            }
          }
        }
			}
			return dest;
    }
  },
  created() {
    this.getOrderingDetail();
    this.$bus.$on("update", () => {
      setTimeout(() => {
        this.getOrderingDetail();
      }, 2000);
    });
  }
};
</script>

<style scoped>
table tr,
th,
td {
  border: 0.5px solid;
  height: 30px;
}
</style>
