<template>
  <div id="app">
    <!-- 导航栏 -->
    <mt-header :title="title" style="padding:0;">
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
            style="width: 100%;display: flex;flex-wrap: wrap;"
          >
            <van-radio
              class="flex-row flex-center"
              icon-size="12px"
              v-for="(item, index) in canteenList"
              :key="index"
              :name="item.id"
              @click="chooseCanteen(item.id)"
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
    <!-- <button @click="test">测试</button> -->
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getUserToken,
  canChooseCant,
  bindCanteen,
  getModules,
  getChooseDinner
} from "./api/user.js";
import { Toast } from "vant";
import store from "@/store";

export default {
  data() {
    return {
      isShow: false,
      show: true, //展示选择饭堂
      radio: null, //当前所选饭堂
      canteen_name: "", //当前所选饭堂名称
      title: ""
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
      if (this.canteen_id == e) {
        return;
      }
      Toast.loading({
        forbidClick: true,
        message: "加载中...",
        buration: 0
      });
      const result = await bindCanteen({
        canteen_id: e
      });
      if (result.errorCode == 0) {
        Toast.clear();
        Toast.success("成功进入饭堂!");
        this.$store.commit("user/setCanteen", e);
        this.$bus.$emit("updatePage"); //注册全局事件
      }
    },
    //跳转微信授权页面获取code
    getCode() {
      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60311f2f47c86a3e&redirect_uri=http%3A%2F%2Fyuncanteen3.51canteen.com%2Fcanteen3%2Fwxcms%2F%23%2Fauthor&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    },
    setTitle() {
      //设置当前标题
      this.canteenList.forEach((item, index) => {
        if (item.id == this.canteen_id) {
          this.canteen_name = item.name;
        }
      });
    }
  },
  watch: {
    $route(now, old) {
      if (now.name == "index" || now.name == "entry") {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    canteen_id(val) {
      this.radio = parseInt(val);
      this.setTitle();
    },
    canteen_name(val) {
      this.title = "当前饭堂:" + val;
    }
  },
  async mounted() {
    const params = new URLSearchParams(window.location.search.substring(1)); //查询url
    const code = params.get("code"); //获取url中的code
    const state = params.get("state");
    // localStorage.setItem("phone", 1);
    // localStorage.setItem("user_token", "e1541b80101d5fb327b60d7867fffef0");
    // localStorage.setItem("canteen_selected", 1);
    // localStorage.setItem("canteen_id", 130);

    if (!localStorage.getItem("user_token") && !code) {
      this.getCode();
    } else {
      if (
        localStorage.getItem("user_token") &&
        localStorage.getItem("phone") == 1
      ) {
        var canteens = new Array();
        const result2 = await canChooseCant(); //返回用户可选饭堂
        if (result2.errorCode == 0) {
          result2.data.forEach((items, index) => {
            items.canteens.forEach((item, key) => {
              canteens.push(item.info);
            });
          });
          this.$store.commit("user/setCanteenList", canteens);
        }
      } else if (localStorage.getItem("phone") == 2) {
        this.$router.push({
          name: "entry"
        });
      }
    }

    this.radio = parseInt(this.canteen_id);
    this.setTitle();
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
