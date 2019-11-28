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
  async created() {
    const params = new URLSearchParams(window.location.search.substring(1)); //查询url
    const code = params.get("code"); //获取url中的code
    const state = params.get("state");
    if (code && state) {
      localStorage.clear();
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
        store.commit("user/setCanteenSelect", res1.data.canteen_selected);
        store.commit("user/setPhone", res1.data.phone);
        console.log(this.isBindCanteen, this.isBindPhone);
        if (this.isBindPhone == 2) {
          this.$router.push("entry");
          Toast.clear();
          return;
        }

        if (this.isBindPhone == 1 && this.isBindCanteen != 1) {
          this.$router.push("setting");
          Toast.clear();
          return;
        }
        //已选择饭堂 缓存饭堂id
        store.commit("user/setCanteen", res1.data.canteen_id);
        Toast.clear();
        if (this.token) {
          this.$router.push({ path: "/" });
          var canteens = new Array();
          const result2 = await canChooseCant();
          if (result2.errorCode == 0) {
            result2.data.forEach((items, index) => {
              items.canteens.forEach((item, key) => {
                canteens.push(item.info);
              });
            });
            store.commit("user/setCanteenList", canteens);
          }
        }
      }
    }
    //获取用户可见模块
    // const result3 = await getModules({ c_id: this.canteen_id });
    // console.log("用户可见模块：", result3);
  },
  computed: {
    ...mapGetters("user", {
      token: "tokenGetters",
      isBindPhone: "getPhoneBind",
      isBindCanteen: "getCanteenSelected"
    })
  }
};
</script>

<style></style>
