<template>
  <div>
    <h3
      style="margin: 0;padding: 25px 0;font-size: 16px;color: #BCBCBC;background-color: rgba(242, 242, 242, 0.8);"
    >你还没添加地址哦，请先添加收货地址</h3>
    <!-- 		<van-cell-group>
			<van-field v-model="address" label="收货地址:" type="textarea" placeholder="请填写详细地址" rows="2" autosize />
			<van-field v-model="name" label="联系人:" placeholder="请填写收货人姓名" />
			<van-radio-group class="flex-row flex-center" style="justify-content: space-around;padding:16px;" v-model="sex">
				<van-radio name="2">女士</van-radio>
				<van-radio name="1">先生</van-radio>
			</van-radio-group>
			<van-field v-model="phone" type="tel" maxlength="11" label="手机号码:" placeholder="请填写收货手机号码" />
		</van-cell-group>
    <van-button style="width: 90%;margin-top: 10px;" size="large" type="info" @click="keepAddress">保存地址</van-button>-->

    <div class="flex-row address">
      <van-button style="position: fixed;left: 10px;" size="small" @click="bindToBack">取消</van-button>
      <h4 style="width: 100%; margin: 15px 0;">新增送餐地址</h4>
    </div>
    <van-address-edit
      :area-list="areaList"
      show-search-result
      area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      :is-saving="isSaving"
    >
      <van-radio-group
        class="flex-row flex-center"
        style="justify-content: space-around;padding:10px 16px;"
        v-model="sex"
      >
        <van-radio name="2">女士</van-radio>
        <van-radio name="1">先生</van-radio>
      </van-radio-group>
    </van-address-edit>
  </div>
</template>

<script>
import { Toast } from "vant";
import { addUserAddress } from "@/api/user.js";
import area from "@/utils/area.js";
export default {
  data() {
    return {
      sex: "", //性别
      areaList: area, //地区选择列表
      isSaving: false //保存按钮加载动画
    };
  },
  methods: {
    //取消返回上一级
    bindToBack() {
      this.$router.go(-1);
    },
    async onSave(content) {
      if (this.sex == "") {
        Toast("请选择性别");
      } else {
        this.isSaving = true;
        const data = {
          province: content.province,
          city: content.city,
          area: content.county,
          address: content.addressDetail,
          name: content.name,
          phone: content.tel,
          sex: this.sex
        };
        const result = await addUserAddress(data);
        if (result.errorCode == 0) {
          this.$router.go(-1);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.address {
  text-align: center;
  align-items: center;
  border-bottom: 1px solid #f2f3f5;
}

.van-address-edit__buttons button {
  background-color: #1989fa !important;
  border: 1px solid #1989fa !important;
}
</style>
