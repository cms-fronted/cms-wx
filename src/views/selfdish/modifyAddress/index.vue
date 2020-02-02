<template>
  <!-- 选择地址 -->
  <div class="modifyaddress">
    <p>{{def.address}}</p>
    <div class="flex-row address">
      <van-button style="position: fixed;left: 10px;" size="small" @click="bindToBack">取消</van-button>
      <h4 style="width: 100%; margin: 15px 0;">请选择送餐地址!</h4>
    </div>
    <!-- 地址列表 -->
    <van-radio-group v-model="radio">
      <div class="list" v-for="(item,index) in list" :key="index">
        <van-radio :name="index" />
        <div>
          <h4 style="margin: 10px 0;">{{item.address}}</h4>
          <h6 style="margin: 5px 0;">{{item.name}}{{item.phone}}</h6>
        </div>
        <van-icon name="edit" size="25px" @click="bindToEditAddress(item)" />
      </div>
    </van-radio-group>
    <div class="flex-row flex-center newaddr" @click="bindToNewAddress">
      <van-icon name="add-o" color="#1989fa" />
      <h4 style="margin-left: 10px; font-size: 14px;">新增收货地址</h4>
    </div>
    <van-popup position="bottom" v-model="pop">
      <van-address-list v-model="radio" :list="list" @add="addAddress" @edit="bindToEditAddress" />
    </van-popup>
  </div>
</template>

<script>
import { getUserAddress } from "@/api/user.js";
export default {
  data() {
    return {
      //地址列表
      list: [],
      def: {}, //默认地址
      radio: "",
      pop: false
    };
  },
  methods: {
    //取消按钮跳转
    bindToBack() {
      this.$router.go(-1);
    },
    bindToNewAddress() {
      this.$router.push("newaddress");
    },
    //编辑地址
    bindToEditAddress(address) {
      console.log("选中编辑地址，地址id：", address);
      this.$router.push({ name: "editaddress", params: { detail: address } });
    },
    address() {}
  },
  async created() {
    //调用获取用户地址接口
    const result = await getUserAddress();
    if (result.errorCode == 0) {
      this.list = result.data;
    }
    this.list.forEach((value, index) => {
      if (value.default == 1) {
        this.radio = index;
        this.def = value;
      }
    });
  }
};
</script>

<style scoped>
.modifyaddress p {
  background-color: rgba(242, 242, 242, 0.8);
  margin: 0;
  padding: 25px 0;
}

.address {
  text-align: center;
  align-items: center;
  border-bottom: 1px solid #f2f3f5;
}

.list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid #f2f3f5;
}

.newaddr {
  position: fixed;
  width: 100%;
  bottom: 0;
  border-top: 1px solid #f2f3f5;
}
</style>
