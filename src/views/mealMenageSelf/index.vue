<template>
  <!-- 菜品管理(个人选菜) -->
  <div id="dish">
    <!-- 选择器 -->
    <div class="picker flex-row">
      <van-button class="btn" type="default" @click="timeEvent">
        {{$moment(date).format("YYYY-MM-DD")}}
        <van-icon name="arrow-down" />
      </van-button>
      <van-button class="btn" type="default" @click="show1 = true">
        {{dinner}}
        <van-icon name="arrow-down" />
      </van-button>
      <van-button class="btn" type="default" @click="show2 = true">
        {{menu}}
        <van-icon name="arrow-down" />
      </van-button>
    </div>
    <ul class="flex-row title-content">
      <li style="width: 25%;">图片</li>
      <li style="width: 25%;">菜品名称</li>
      <li style="width: 10%;">单价</li>
      <li style="width: 15%;">上架</li>
      <li style="width: 15%;">默认</li>
    </ul>
    <!-- 左边菜单栏 -->
    <div class="foodList">
      <ul>
        <li v-for="(item, index) in foodList.data" :key="index">
          <table border="0" cellpadding="0" cellspacing="0" style="border:#FFFFFF;">
            <tr>
              <td style="width: 25%;">
                <img :src="item.img_url" style="width: 100%;height: 60px;" />
              </td>
              <td style="width: 25%;">{{item.name}}</td>
              <td style="width: 10%;">{{item.price}}</td>
              <td
                style="width: 15%;"
                class="flex-row flex-center"
                @click="changeStatus(item,index)"
              >
                <van-checkbox v-model="item.status" />
              </td>
              <td
                style="width: 15%;"
                class="flex-row flex-center"
                @click="changeDefault(item,index)"
              >
                <van-checkbox v-model="item.default" />
              </td>
            </tr>
          </table>
        </li>
      </ul>
    </div>

    <!-- 弹出层&时间选择器 -->
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        @cancel="timeEvent"
        type="date"
        @confirm="timeEvent"
      />
    </van-popup>
    <!-- 弹出层&饭堂选择器 -->
    <van-popup v-model="show1" position="bottom">
      <van-picker
        show-toolbar
        :columns="dinnerList"
        value-key="name"
        @cancel="show1 = false;"
        @confirm="dinnerEvent"
      />
    </van-popup>
    <!-- 弹出层&菜类型选择器 -->
    <van-popup v-model="show2" position="bottom">
      <van-picker
        show-toolbar
        :columns="menuList"
        value-key="name"
        @cancel="show2 = false"
        @confirm="typeEvent"
      />
    </van-popup>
  </div>
</template>

<script>
import { getChooseDinner } from "@/api/user.js";
import { getMenuId, getFoodList, changeType } from "@/api/mealMenage.js";
import { Toast } from "vant";
Toast.allowMultiple;
import { mapGetters } from "vuex";

export default {
  name: "dish",
  data() {
    return {
      active: 0,
      foodList: {},
      date: "", //时间显示文字
      currentDate: new Date(), //临时时间
      menu: "菜类", //类型按钮显示
      menu_id: null,
      menuList: [], //picker类型显示列表
      dinner: "餐次", //餐次类型按钮显示
      dinner_id: null,
      dinnerList: [],
      show: false,
      show1: false,
      show2: false
    };
  },
  methods: {
    // 时间选择器事件
    timeEvent(e) {
      if (!e) {
      } else if (e.isTrusted) {
      } else {
        this.date = this.currentDate;
      }
      this.show = !this.show;
    },
    // 选择餐次
    async dinnerEvent(e) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.dinner = e.name;
      this.dinner_id = e.id;
      this.show1 = false;
      //调用获取菜类型接口
      //2、获取可选择的菜类型（荤菜、素菜、汤）
      const result = await getMenuId({
        dinner_id: this.dinner_id
      });
      if (result.errorCode == 0) {
        this.menuList = result.data;
      }
      this.menu = "菜类";
      Toast.clear();
    },
    //类型选择
    async typeEvent(e) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.menu = e.name;
      this.menu_id = e.id;
      //调用获取菜品列表
      const result = await getFoodList({
        page: 1,
        size: 12,
        food_type: 2,
        menu_id: e.id,
        day: this.$moment(this.date).format("YYYY-MM-DD"),
        canteen_id: this.getCanteenId
      });
      console.log("菜品管理信息：", result);
      if (result.errorCode == 0) {
        //将结果配置成匹配的格式
        result.data.data.forEach((item, index) => {
          item.status == 1 ? (item.status = true) : (item.status = false);
          item.default == 1 ? (item.default = true) : (item.default = false);
        });
      }
      this.foodList = result.data;
      this.show2 = !this.show2;
      Toast.clear();
    },
    shelfClick(e, k) {
      console.log(e, ",", k);
    },
    //上架
    changeStatus(e, index) {
      this.$dialog
        .confirm({
          title: "设置",
          message: "是否更新状态",
          confirmButtonText: "是" //确认按钮文本
        })
        .then(() => {
          const data = {
            food_id: e.id,
            canteen_id: this.getCanteenId,
            day: this.$moment(this.date).format("YYYY-MM-DD"),
            status: e.status ? 1 : 2,
            default: e.default ? 1 : 2
          }; //整理请求参数
          Toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0
          });
          changeType(data).then(e => {
            Toast.clear();
            if (e.errorCode == 0) {
              Toast.success("上架成功!");
            } else {
              Toast.success("上架成功!");
              this.foodList.data[index].status = !this.foodList.data[index]
                .status;
            }
          }); //调用api
        })
        .catch(() => {
          //confirm
          this.foodList.data[index].status = !this.foodList.data[index].status;
        });
    },
    //默认
    changeDefault(e, index) {
      console.log("默认", e);
      this.$dialog
        .confirm({
          title: "设置",
          message: "是否更新状态",
          confirmButtonText: "是" //确认按钮文本
        })
        .then(() => {
          //调用改变商品状态接口
          if (!e.status) {
            Toast.fail("请先上架该菜品！");
            this.foodList.data[index].default = !this.foodList.data[index]
              .default;
          } else {
            const data = {
              food_id: e.id,
              canteen_id: this.getCanteenId,
              day: this.$moment(this.date).format("YYYY-MM-DD"),
              status: e.status ? 1 : 2,
              default: e.default ? 1 : 2
            };
            Toast.loading({
              message: "加载中...",
              forbidClick: true,
              duration: 0
            });
            changeType(data).then(e => {
              Toast.clear();
              if (e.errorCode == 0) {
                Toast.success("设置默认成功!");
              } else {
                this.foodList.data[index].default = !this.foodList.data[index]
                  .default;
              }
            });
          }
        })
        .catch(() => {
          //confirm
          this.foodList.data[index].default = !this.foodList.data[index]
            .default;
        });
    }
  },
  async created() {
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0
    });
    //1、获取可选择的餐次（餐次信息：早中晚）
    const result = await getChooseDinner();
    if (result.errorCode == 0) {
      this.dinnerList = result.data;
    }

    //3、用餐次id和菜类型id调用获取菜品信息接口
    this.date = new Date();

    Toast.clear();
  },
  computed: {
    ...mapGetters("user", {
      getCanteenId: "canteenIdGetters"
    }),
    dinnerCom: function() {
      let name = "餐次";
      if (this.dinnerInfo.length > 0) {
        this.dinnerInfo.forEach((item, index) => {
          if (this.dinner == item.id) {
            name = item.name;
          }
        });
      }
      return name;
    },
    menuCom() {
      let name = "菜类";
      if (this.menuInfo.length > 0) {
        this.menuInfo.forEach((item, index) => {
          if (this.type == item.id) {
            name = item.name;
          }
        });
      }
      return name;
    }
  },
  mounted() {
    this.$bus.$on("updatePage", async () => {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.menu = "菜类";
      this.menuList = [];
      this.dinner = "餐次";
      this.dinnerList = [];
      this.foodList = {};
      //1、获取可选择的餐次（餐次信息：早中晚）

      setTimeout(async () => {
        const result = await getChooseDinner();
        if (result.errorCode == 0) {
          this.dinnerList = result.data;
        }
      }, 2000);

      Toast.clear();
    });
  }
};
</script>

<style scoped="">
#dish {
  background-color: #ffffff;
  overflow: hidden;
}

.picker {
  justify-content: space-around;
  align-items: center;
  height: 70px;
  background-color: #ffffff;
}

.btn {
  border-radius: 10px;
}

.tables {
  width: 100%;
  border-right: 1px solid #c8c9cc;
  border-bottom: 1px solid #c8c9cc;
}

.tables td {
  border-left: 1px solid #c8c9cc;
  border-top: 1px solid #c8c9cc;
}

.tables img {
  width: 70px;
  height: 40px;
}

.cbox {
  justify-content: center;
}

#tabs {
  background-color: #ffffff;
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

.foodList {
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

.foodList p {
  font-size: 10px;
  color: #969799;
  text-align: center;
  width: 100%;
  border-bottom: 1px solid #c8c9cc;
}
</style>
