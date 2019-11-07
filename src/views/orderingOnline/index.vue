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
        <td v-for="i in mealList.length+1" :key="i">{{i === 1 ? item.ordering_date : null}}</td>
        <!-- <td>
          <span>{{item.ordering_date}}</span>
        </td>
        <td v-for="(i,key) in mealList" :key="key"></td>-->
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
import { compileFunction } from "vm";
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
          ordering_date: _date
        });
      }
    },
    openOrderDialog(row, e) {
      if (!this.$refs.tableForm.rows[0].cells[e.target.cellIndex]) return;
      console.log(
        this.$refs.tableForm.rows[0].cells[e.target.cellIndex].dataset.id
      );
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
    //处理数据， 合并日期为同一天的数据，并将有数据的日期对象插入到 dateList 并排序
    matchOrderToData() {
      let objDate = this.dateList;
      let objOrder = this.orderDataList;
      objOrder = this.fireDuplicate(objOrder);
      let result = [];
      result = this.arrayRepeat(objOrder, objDate);
      let objDetail = [...objOrder, ...result];
      objDetail = this.forwardRankingDate(objDetail, "ordering_date");
      this.dateList = objDetail;
      console.log(this.dateList);
    },
    //日期排序方法
    forwardRankingDate(data, p) {
      for (let i = 0; i < data.length - 1; i++) {
        for (let j = 0; j < data.length - 1 - i; j++) {
          if (Date.parse(data[j][p]) > Date.parse(data[j + 1][p])) {
            var temp = data[j];
            data[j] = data[j + 1];
            data[j + 1] = temp;
          }
        }
      }
      return data;
    },
    fireDuplicate(arr) {
      //转换数据格式 ， 合并日期为同一天的数据
      let map = {},
        dest = [];
      for (let i = 0; i < arr.length; i++) {
        let ai = arr[i];
        if (!map[ai.ordering_date]) {
          dest.push({
            ordering_date: ai.ordering_date,
            canteen: ai.canteen,
            count: ai.count,
            data: [ai]
          });
          map[ai.ordering_date] = ai;
        } else {
          for (let j = 0; j < dest.length; j++) {
            let dj = dest[j];
            if (dj.ordering_date == ai.ordering_date) {
              dj.data.push(ai);
              break;
            }
          }
        }
      }
      return dest;
    },
    //比较数组对象，取出某一键值不同的数据，此处比较ordering_date
    arrayRepeat(array1, array2) {
      var result = [];
      for (var i = 0; i < array2.length; i++) {
        var obj = array2[i];
        var num = obj.ordering_date;
        var isExist = false;
        for (var j = 0; j < array1.length; j++) {
          var aj = array1[j];
          var n = aj.ordering_date;
          if (n === num) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          result.push(obj);
        }
      }
      return result;
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
