<template>
  <div>
    <p style="text-align: left;font-size: 13px;padding: 0 20px;">企业选择</p>
    <!-- 企业人员 -->
    <van-radio-group v-model="radio" v-if="outSiders == 2">
      <van-cell-group v-for="(items,index) in list" :key="index">
        <van-cell
          title-style="text-align:left;"
          icon="home-o"
          :title="items.company.name"
          clickable
          @click="radio = items.id"
        >
          <!-- <van-radio slot="right-icon" :name="items.id" /> -->
        </van-cell>
        <div
          style="padding-left: 50px;width: auto;text-align: left;"
          v-for="(item,key) in items.canteens"
          :key="key"
        >
          <van-cell
            :title="item.info.name"
            style="border-bottom: 0.5px solid #F2F3F5;"
            clickable
            @click="choiceCanteen(item,items.company.id)"
          >
            <van-icon v-if="item.check" name="passed" color="#26A2FF" />
          </van-cell>
        </div>
      </van-cell-group>
    </van-radio-group>
    <!-- 外部人员 -->
    <van-radio-group v-model="radio" v-else>
      <van-cell-group v-for="(items,index) in list" :key="index">
        <van-cell
          title-style="text-align:left;"
          icon="home-o"
          :title="items.canteen"
          clickable
          @click="choiceCanteenLimit(items)"
        >
          <!-- <van-radio slot="right-icon" :name="items.id" /> -->
        </van-cell>
        <!-- <div
          style="padding-left: 50px;width: auto;text-align: left;"
          v-for="(item,key) in items.canteens"
          :key="key"
        >
          <van-cell
            :title="item.info.name"
            style="border-bottom: 0.5px solid #F2F3F5;"
            clickable
            @click="choiceCanteen(item,items.company.id)"
          >
            <van-icon v-if="item.check" name="passed" color="#26A2FF" />
          </van-cell>
        </div>-->
      </van-cell-group>
    </van-radio-group>
  </div>
</template>

<script>
import { canChooseCant, bindCanteen } from "@/api/user.js";
import { mapGetters } from "vuex";
import { Toast } from "vant";

export default {
  data() {
    return {
      radio: null,
      list: [],
      outSiders: localStorage.getItem("out_siders")
    };
  },
  async created() {
    Toast.loading({
      forbidClick: true,
      duration: 0
    });
    //获取用户可选择的饭堂
    const result = await canChooseCant();
    let outSiders = localStorage.getItem("out_siders");
    if (result.errorCode == 0 && outSiders == 2 && result.data.length != 0) {
      this.list = result.data;
      this.list.forEach((items, index) => {
        items.canteens.forEach((item, key) => {
          if (item.info.id == this.canteen_id) {
            this.list[index].canteens[key] = Object.assign(
              this.list[index].canteens[key],
              {
                check: true
              }
            );
          }
        });
      });
    } else if (
      // 外来人员接口数据处理
      result.errorCode == 0 &&
      outSiders == 1 &&
      result.data.length != 0
    ) {
      this.list = result.data;
      this.list.forEach((items, index) => {
        if (items.canteen_id == this.canteen_id) {
          this.list[index] = Object.assign(this.list[index], { check: true });
        }
      });
    }
    Toast.clear();
  },
  methods: {
    choiceCanteen(e, company_id) {
      this.$dialog
        .confirm({
          message: "是否选择" + e.info.name + "?"
        })
        .then(() => {
          Toast.loading({
            forbidClick: true,
            duration: 0
          });
          bindCanteen({
            canteen_id: e.canteen_id
          }).then(result => {
            console.log(result);
            if (result.errorCode == 0) {
              Toast.success("选择成功！");
              this.$store.commit("user/setCanteen", e.canteen_id);
              this.$router.push({
                path: "/"
              });
            }
          });
          Toast.clear();
        });
    },
    // 外部人员选择饭堂
    async choiceCanteenLimit(values) {
      console.log(values);
      this.$dialog
        .confirm({ message: "是否选择" + values.canteen + "?" })
        .then(() => {
          Toast.loading({
            forbidClick: true,
            duration: 0
          });
          bindCanteen({
            canteen_id: values.canteen_id
          }).then(result => {
            console.log(result);
            if (result.errorCode == 0) {
              Toast.success("选择成功！");
              this.$store.commit("user/setCanteen", values.canteen_id);
              this.$router.push({
                path: "/"
              });
            }
          });
          Toast.clear();
        });
    }
  },
  computed: {
    ...mapGetters("user", {
      canteen_id: "canteenIdGetters"
    })
  }
};
</script>

<style>
</style>
