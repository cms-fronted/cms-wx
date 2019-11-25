<template>
  <div id="app">
    <!-- 导航栏 -->
    <mt-header title="云饭堂" style="padding:0;">
      <div @click="back" slot="left" v-show="isShow">
        <mt-button icon="back">返回</mt-button>
      </div>
    </mt-header>
    <!-- 饭堂选择 -->
    <van-sticky>
      <!-- 饭堂选择下拉箭头 -->
      <div class="shadow" style="background-color: #FFFFFF;margin-bottom: 10px">
        <div
          class="flex-column"
          style="width: auto;align-items: flex-end;padding-right: 20px;"
          @click="showCanteen"
        >
          <van-icon size="32px" :name="!show ? 'arrow-up' : 'arrow-down'" />
        </div>
        <div v-bind:hidden="show">
          <van-radio-group
            v-model="radio"
            @change="chooseCanteen"
            style="width: 100%;display: flex;flex-wrap: wrap;"
          >
            <van-radio
              class="flex-row flex-center"
              :name="item.id"
              icon-size="12px"
              v-for="(item, index) in canteenList"
              :key="index"
              style="width: 33%; margin: 10px 0"
              >{{ item.name }}</van-radio
            >
          </van-radio-group>
        </div>
      </div>
    </van-sticky>
    <!-- <van-popup v-model="show" :overlay="false" position="top"  style="margin-top: 40px;" closeable :lock-scroll="false" >
			
    </van-popup>-->
    <!-- 		<keep-alive>
			<router-view v-if="!$route.meta.noCache" />
    </keep-alive>-->
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getUserToken,
  canChooseCant,
  bindCanteen,
  getModules
} from "./api/user.js";
import { Toast } from "vant";

export default {
  data() {
    return {
      isShow: false,
      show: true,
      radio: ""
    };
  },
  methods: {
    showCanteen() {
      this.show = !this.show;
    },
    back() {
      this.$router.go(-1);
    },
    //用户选择饭堂
    async chooseCanteen(e) {
      Toast.loading({
        forbidClick: true,
        message: "加载中...",
        buration: 0
      });
      await bindCanteen({
        canteen_id: e
      })
        .then(result => {
          if (result.errorCode == 0) {
            this.$store.commit("user/setCanteen", e);
            this.$bus.$emit("updatePage"); //注册全局事件
            Toast.clear();
            Toast.success("成功进入饭堂!");
          }
        })
        .then(() => {});
    }
  },
  watch: {
    $route(now, old) {
      if (now.name == "index" || now.name == "entry") {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    }
  },
  async created() {
    Toast.loading({
      forbidClick: true,
      duration: 0
    });
    if (this.$router.path !== "/") {
      // this.$router.replace("/");
    }
    //获取用户信息判断该用户是否绑定手机或饭堂
    

    const result = await getUserToken();
    
    //缓存token
    this.$store.commit("user/setToken", result.data.token);
    if (result.data.phone == 2) {
      //用户未绑定手机
      this.$router.push("entry");
      Toast.clear();
      return;
    } else if (result.data.canteen_selected == 2) {
      //未选择饭堂进入饭堂选择页
      this.$router.push("setting");
      Toast.clear();
      return;
    }
    //已选择饭堂 缓存饭堂id
    this.$store.commit("user/setCanteen", result.data.canteen_id);
    //设置显示已选饭堂 缓存获取
    this.radio = this.canteen_id;
    //设置显示可选饭堂 获取用户可进入饭堂
    var canteens = new Array();
    const result2 = await canChooseCant();
    if (result2.errorCode == 0) {
      result2.data.forEach((items, index) => {
        items.canteens.forEach((item, key) => {
          canteens.push(item.info);
        });
      });
      this.$store.commit("user/setCanteenList", canteens);
    }

    //获取用户可见模块
    const result3 = await getModules({ c_id: this.canteen_id });
    console.log("用户可见模块：", result3);

    Toast.clear();
  },
  computed: {
    ...mapGetters("user", {
      token: "tokenGetters",
      canteenList: "canteenListGetters",
      canteen_id: "canteenIdGetters"
    })
  }
};
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  mt-header {
    position: fixed;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

body {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #ffffff;
  margin: 0;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-center {
  justify-content: center;
  align-items: center;
}

.shadow {
  box-shadow: 5px 5px 10px 0px #ccc;
}

.mIcon {
  position: absolute;
  top: 50%;
  right: -4px;
  margin-top: -5px;
  margin-right: 15px;
  border: 3px solid;
  border-color: transparent transparent currentColor currentColor;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  opacity: 0.8;
  content: " ";
}

.myBtn {
  border-radius: 10px !important;
  width: 100px;
}
</style>
