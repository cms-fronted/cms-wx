<template>
  <div>授权中。。。</div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getUserToken,
  canChooseCant,
  bindCanteen,
  getModules
} from "@/api/user.js";
import { Toast } from "vant";
import store from "@/store";
export default {
  data() {},
  methods: {},
  async created() {
    const params = new URLSearchParams(window.location.search.substring(1)); //查询url
    const code = params.get("code"); //获取url中的code
    const state = params.get("state");
    if (code && state) {
      Toast.loading({
        forbidClick: true,
        duration: 0
      });
      const res1 = await getUserToken({
        code: code,
        state: state
      });
      if (res1.msg === "ok") {
        store.commit("user/setToken", res1.data.token);
        if (res1.data.phone == 2) {
          this.$router.push("entry");
          Toast.clear();
          return;
        } else if (res1.data.canteen_selected == 2) {
          //未选择饭堂进入饭堂选择页
          this.$router.push("setting");
          Toast.clear();
          return;
        }
        //已选择饭堂 缓存饭堂id
        store.commit("user/setCanteen", res1.data.canteen_id);
        if (localStorage.getItem("user_token")) {
          this.$router.push("index");
        }
        Toast.clear();
      }
    }
    /*  if (code && state) {
      Toast.loading({
        forbidClick: true,
        duration: 0
      });
      //获取用户token信息，判断该用户是否绑定手机或饭堂
      const result = await getUserToken({
        code: code,
        state: state
      });
      //缓存token
      if (result.errorCode == 0) {
        store.commit("user/setToken", result.data.token);
        if (result.data.phone == 2) {
          //用户未绑定手机
          this.$router.push("entry");
          console.log(this.token);
          Toast.clear();
          return;
        } else if (result.data.canteen_selected == 2) {
          //未选择饭堂进入饭堂选择页
          this.$router.push("setting");
          Toast.clear();
          return;
        }
        //已选择饭堂 缓存饭堂id
        store.commit("user/setCanteen", result.data.canteen_id);
        //设置显示已选饭堂 缓存获取
        this.radio = this.canteen_id;
      }
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
      // const result3 = await getModules({ c_id: this.canteen_id });
      // console.log("用户可见模块：", result3);

      Toast.clear();
    } */
  },
  computed: {
    ...mapGetters("user", {
      token: "tokenGetters"
    })
  }
};
</script>

<style></style>
