<template>
  <!-- 外卖管理 -->
  <div class="flex-column toke-out">
    <!-- 选择器 -->
    <div class="flex-row" style="flex-wrap: wrap;justify-content:space-around;">
      <van-button style="border-radius: 10px;width: 40%;" @click="datePop = true">
        {{date}}
        <van-icon name="arrow-down" />
      </van-button>
      <van-button style="border-radius: 10px;width: 40%;" @click="dinnerPop = true">
        {{dinner}}
        <van-icon name="arrow-down" />
      </van-button>
      <van-button style="border-radius: 10px;width: 40%;margin-top: 20px;" @click="typePop = true">
        {{type}}
        <van-icon name="arrow-down" />
      </van-button>
      <van-button
        style="border-radius: 10px;width: 40%;margin-top: 20px;"
        @click="departmentPop = true"
      >
        {{department}}
        <van-icon name="arrow-down" />
      </van-button>
    </div>
    <!-- 外卖单详情 已接单 -->
    <div style="margin:8px;border-radius:4px;border: 0.5px solid rgba(235, 235, 235, 1);">
      <div class="flex-row" style="justify-content:space-between;padding:0 11px;">
        <p style="color: rgba(58, 58, 58, 0.65);font-size: 12px;">订单id：</p>
        <p style="color: rgba(16, 16, 16, 1);font-size: 13px;">已接单</p>
      </div>
      <p
        style="font-size: 18px;text-align: left;margin:0;font-weight:600;padding:0 11px;"
      >收货地址收货地址收货地址收货地址收货地址收货地址</p>
      <p style="font-size: 12px;text-align:left;padding:0 11px;">
        <span>收货人姓名</span>
        <span style="margin-left:10px;">18219002000</span>
      </p>
      <van-collapse v-model="activeNames" style="padding:0">
        <van-collapse-item :title="title" name="1">
          <div
            class="flex-row"
            style="justify-content:space-between;font-size: 13px;"
            v-for="index in 3"
            :key="index"
          >
            <p style="margin:0;">
              <span>菜品名称1</span>
              <span>X1</span>
            </p>
            <p style="margin:0;">2元</p>
          </div>
          <div style="margin:5px 0;border: 0.5px solid rgba(235, 235, 235, 1);"></div>
          <div class="flex-row" style="justify-content:space-between;font-size: 13px;">
            <p style="margin:0;">小计</p>
            <p style="margin:0;">5元</p>
          </div>
          <div class="flex-row" style="justify-content:space-between;font-size: 13px;">
            <p style="margin:0;">配送费</p>
            <p style="margin:0;">6元</p>
          </div>
          <div class="flex-row" style="justify-content:space-between;font-size: 13px;">
            <p style="margin:0;">总计</p>
            <p style="margin:0;">9元</p>
          </div>
        </van-collapse-item>
      </van-collapse>
      <div class="flex-row">
        <div style="width:30%">
          <van-button icon="phone" size="large" style="border:none;">联系客户</van-button>
        </div>
        <div style="width:70%">
          <van-button icon="phone" size="large" color="#00B870">订单已送达</van-button>
        </div>
      </div>
    </div>
    <!-- 订单详情--已完成 -->
    <div style="margin:8px;border-radius:4px;border: 0.5px solid rgba(235, 235, 235, 1);">
      <div class="flex-row" style="justify-content:space-between;padding:0 11px;">
        <p style="color: rgba(58, 58, 58, 0.65);font-size: 12px;">订单id：</p>
        <p style="color: rgba(16, 16, 16, 1);font-size: 13px;">已完成</p>
      </div>
      <p
        style="font-size: 18px;text-align: left;margin:0;font-weight:600;padding:0 11px;"
      >收货地址收货地址收货地址收货地址收货地址收货地址</p>
      <p style="font-size: 12px;text-align:left;padding:0 11px;">
        <span>收货人姓名</span>
        <span style="margin-left:10px;">18219002000</span>
      </p>
      <van-collapse v-model="activeNames" style="padding:0">
        <van-collapse-item :title="title" name="1">
          <div
            class="flex-row"
            style="justify-content:space-between;font-size: 13px;"
            v-for="index in 3"
            :key="index"
          >
            <p style="margin:0;">
              <span>菜品名称1</span>
              <span>X1</span>
            </p>
            <p style="margin:0;">2元</p>
          </div>
          <div style="margin:5px 0;border: 0.5px solid rgba(235, 235, 235, 1);"></div>
          <div class="flex-row" style="justify-content:space-between;font-size: 13px;">
            <p style="margin:0;">小计</p>
            <p style="margin:0;">5元</p>
          </div>
          <div class="flex-row" style="justify-content:space-between;font-size: 13px;">
            <p style="margin:0;">配送费</p>
            <p style="margin:0;">6元</p>
          </div>
          <div class="flex-row" style="justify-content:space-between;font-size: 13px;">
            <p style="margin:0;">总计</p>
            <p style="margin:0;">9元</p>
          </div>
        </van-collapse-item>
      </van-collapse>
      <p
        style="color: rgba(16, 16, 16, 0.65);font-size: 10px;text-align: right;padding:0 11px;"
      >2020.02.17 14:00:00 送达</p>
    </div>
    <!-- 弹窗选择器 时间、餐次、类型、部门 -->
    <van-popup v-model="datePop" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @confirm="choodeDate"
        @cancel="datePop=false"
      />
    </van-popup>
    <van-popup v-model="dinnerPop" position="bottom">
      <van-picker
        :columns="dinnerList"
        value-key="name"
        show-toolbar
        @cancel="dinnerPop = false"
        @confirm="chooseDinner"
      />
    </van-popup>
    <van-popup v-model="typePop" position="bottom">
      <van-picker
        :columns="typeList"
        value-key="name"
        show-toolbar
        @cancel="typePop = false"
        @confirm="chooseType"
      />
    </van-popup>
    <van-popup v-model="departmentPop" position="bottom">
      <van-picker
        :columns="departmentList"
        value-key="name"
        show-toolbar
        @cancel="departmentPop = false"
        @confirm="chooseDepartment"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: "2020-02-20",
      dinner: "全部",
      type: "全部",
      department: "全部",
      datePop: false,
      dinnerPop: false,
      departmentPop: false,
      typePop: false,
      currentDate: new Date(),
      dinnerList: [
        { name: "全部" },
        { name: "早餐" },
        { name: "中餐" },
        { name: "晚餐" }
      ],
      typeList: [{ name: "全部" }, { name: "已结单" }, { name: "已完成" }],
      departmentList: [{ name: "全部" }, { name: "部门a" }, { name: "部门b" }],
      activeNames: [], //折叠面板
      title: "分数*1"
    };
  },
  methods: {
    choodeDate(e) {
      this.date = this.$moment(e).format("YYYY-MM-DD");
      this.datePop = false;
    },
    chooseDinner(e) {
      this.dinner = e.name;
      this.dinnerPop = false;
    },
    chooseType(e) {
      this.type = e.name;
      this.typePop = false;
    },
    chooseDepartment(e) {
      this.department = e.name;
      this.department = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.toke-out {
  align-items: center;
  text-align: left;
}
.van-collapse-item__content {
  padding: 0 !important;
}
</style>