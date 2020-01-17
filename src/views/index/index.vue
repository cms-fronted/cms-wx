<template>
  <div id="index">
    <!-- 轮播图 -->
    <van-swipe :autoplay="4000" class="swip">
      <van-swipe-item v-for="(item, index) in imgs" :key="index">
        <van-image :src="item.imgSrc" />
      </van-swipe-item>
    </van-swipe>
    <div class="list">
      <!-- <p style="line-height: 5px;">个人应用</p> -->
      <ul style="margin-bottom: 60px;">
        <li v-for="(item, index) in grid" :key="index">
          <!-- 设置路由 -->
          <router-link :to="item.url" style="width: 100%;">
            <img :src="item.icon" />
            <p>{{ item.name }}</p>
          </router-link>
        </li>
      </ul>
      <!-- <p style="line-height: 5px;">管理应用</p> -->
      <!-- <ul style="margin-bottom: 60px;">
        <li v-for="(item,index) in mGrid" :key="index">
          <router-link :to="item.url" style="width: 100%;">
            <img :src="item.icon" />
            <p>{{item.name}}</p>
          </router-link>
        </li>
      </ul>-->
    </div>
    <router-link to="/ecard">
      <div class="m-foot flex-row flex-center">
        <img src="../../assets/code.png" />
        <p>电子饭卡</p>
      </div>
    </router-link>
  </div>
</template>

<script>
import { getModules } from "@/api/user.js";
import img1 from "../../assets/index1.jpg";
import img2 from "../../assets/index2.jpg";
import img3 from "../../assets/index3.jpg";
export default {
  name: "index",
  data() {
    return {
      imgs: [
        {
          imgSrc: img1
        },
        {
          imgSrc: img2
        },
        {
          imgSrc: img3
        }
      ],
      grid: [
        // {
        //   category: "1",
        //   name: "线上餐厅",
        //   icon: require("../../assets/canting.png"),
        //   url: "orderingOnline"
        // },
        // {
        //   category: "2",
        //   name: "个人选菜",
        //   icon: require("../../assets/selfmenu.png"),
        //   type: 0,
        //   url: "selfdish"
        // },
        // {
        //   category: "3",
        //   name: "菜谱查看",
        //   icon: require("../../assets/menu.png"),
        //   type: 0,
        //   url: "menu"
        // },
        // {
        //   category: "4",
        //   name: "订单查询",
        //   icon: require("../../assets/order.png"),
        //   type: 0,
        //   url: "order"
        // },
        // {
        //   category: "5",
        //   name: "消费查询",
        //   icon: require("../../assets/xiaofei.png"),
        //   type: 0,
        //   url: "consume"
        // },
        // {
        //   category: "6",
        //   name: "微信充值",
        //   icon: require("../../assets/chongzhi.png"),
        //   type: 0,
        //   url: "recharge"
        // },
        // {
        //   category: "7",
        //   name: "通知",
        //   icon: require("../../assets/tongzhi.png"),
        //   type: 0,
        //   url: "note"
        // },
        // {
        //   category: "8",
        //   name: "设置",
        //   icon: require("../../assets/setting.png"),
        //   type: 0,
        //   url: "setting"
        // },
        // {
        //   category: "9",
        //   name: "小卖部",
        //   icon: require("../../assets/canting.png"),
        //   url: "Store"
        // }
      ],
      mGrid: [
        // {
        //   category: "1",
        //   name: "菜品管理(菜谱查询)",
        //   icon: "img/release.4c279efa.png",
        //   type: 0,
        //   url: "mealMenage"
        // },
        // {
        //   category: "2",
        //   name: "菜品管理(个人选菜)",
        //   icon: "/assets/manage.png",
        //   type: 0,
        //   url: "mealMenageSelf"
        // },
        // {
        //   category: "3",
        //   name: "总订餐查询",
        //   icon: "/assets/search.png",
        //   type: 0,
        //   url: "totalorder"
        // },
        // {
        //   category: "4",
        //   name: "公告发布",
        //   icon: require("../../assets/release.png"),
        //   type: 0,
        //   url: "notice"
        // }
      ]
    };
  },
  methods: {
    beforeCreat() {
      document
        .querySelector("body")
        .setAttribute("style", "background-color: #F4F2F2;");
    },
    async setModule() {
      //设置当前可见模块
      const result = await getModules();
      if (result.errorCode == 0) {
        console.log(result);
        this.mGrid = result.data;
        this.mGrid.forEach((item, index) => {
          item.icon = "http://yuncanteen3.51canteen.com/canteen3" + item.icon;
        });
      }
      this.grid = this.mGrid;
    }
  },
  async mounted() {
    await this.setModule();
  }
};
</script>

<style scoped>
.swip {
  width: 100%;
  height: 200px;
  box-shadow: 0px 15px 10px -14px #ccc;
  border-radius: 10px;
}

.im {
  max-width: 100%;
  width: auto;
  height: auto;
}

.list {
  width: 100%;
  margin-top: 10px;
}

.list ul {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0;
  border-radius: 5px;
  box-shadow: 5px 5px 10px 0px #ccc;
}

.list ul li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  width: 30%;
  font-size: 12px;
  padding-top: 10px;
  margin: 20px 10%;
  box-shadow: 5px 5px 10px 0px #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.list ul li:active {
  box-shadow: 0px 0px 10px #ccc;
}

.list ul li img {
  width: 30px;
}

.list ul li p {
  margin-top: 5px;
  color: #323233 !important;
}

.m-foot {
  background-color: #ffffff;
  position: fixed;
  width: 100%;
  height: 50px;
  bottom: 0;
}

.m-foot img {
  width: 20px;
  margin-right: 10px;
}
</style>
