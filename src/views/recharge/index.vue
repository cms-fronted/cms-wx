<template>
  <!-- 微信充值 -->
  <div class="flex-column" style="margin-top: 20px;">
    <van-cell-group>
      <van-field v-model="phone" label="手机号码" readonly />
      <van-field v-model="money" label="充值金额" placeholder="请输入10的倍数的金额" label-align="left" />
    </van-cell-group>
    <div style="position: fixed; bottom: 0;width: 90%;padding: 90px 5%;">
      <van-button type="primary" size="large" @click="show = true">充值</van-button>
    </div>

    <van-dialog v-model="show" title="充值确认" show-cancel-button @confirm="recharge" @cancel="cancel">
      <div style="padding-left: 30px;text-align: left;">
        <p>姓名：{{ name }}</p>
        <p>手机号码：{{ phone }}</p>
        <p>充值金额：{{ money }}</p>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { Dialog, CellGroup, Toast } from "vant";
import { getRechargeId, getPayInfo, getUserPhone } from "@/api/user.js";

import wx from "weixin-js-sdk";

// var vm = this;
// if (typeof WeixinJSBridge == "undefined") {
//   //微信浏览器内置对象。参考微信官方文档
//   if (document.addEventListener) {
//     document.addEventListener(
//       "WeixinJSBridgeReady",
//       vm.onBridgeReady(data),
//       false
//     );
//   } else if (document.attachEvent) {
//     document.attachEvent("WeixinJSBridgeReady", vm.onBridgeReady(data));
//     document.attachEvent("onWeixinJSBridgeReady", vm.onBridgeReady(data));
//   }
// } else {
//   vm.onBridgeReady(data);
// }

// import { getUserPhone } from "@/api/user.js";

export default {
  data() {
    return {
      phone: "",
      money: 0,
      show: false,
      name: "陈琅斌"
    };
  },
  methods: {
    async recharge() {
      Toast.loading({
        forbidClick: true,
        duration: 0
      });
      //获取订单id
      const result = await getRechargeId({
        money: this.money,
        method_id: 1
      });

      // result.data.id 订单id
      if (result.errorCode == 0) {
        const result2 = await getPayInfo({
          order_id: result.data.id
        });
        if (result2.errorCode == 0) {
          const data = {
            appId: result2.data.appid, //公众号名称，由商户传入
            timeStamp: new Date().getTime().toString(), //时间戳
            nonceStr: result2.data.nonce_str, //随机串
            package: "prepay_id=" + result2.data.prepay_id, //预支付id
            signType: "MD5", //微信签名方式
            paySign: result2.data.sign //微信签名
          };
          await this.onBridgeReady(data);
        }
      }
      Toast.clear();
    },
    cancel() {
      console.log("取消充值!");
    },
    //调用微信js api 支付
    onBridgeReady(data) {
      var vm = this;
      wx.invoke(
        "getBrandWCPayRequest",
        {
          debug: true,
          appId: data.appId, //公众号名称，由商户传入
          timeStamp: data.timeStamp, //时间戳
          nonceStr: data.nonceStr, //随机串
          package: data.packageValue, //预支付id
          signType: data.signType, //微信签名方式
          paySign: data.paySign //微信签名
        },
        function(res) {
          console.log(res);
          //debugger;
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          if (res.err_msg == "get_brand_wcpay_request：ok") {
            alert("支付成功");
            //vm.$router.push("/reservedBerth");
          } else {
            //alert("支付失败,请跳转页面"+res.err_msg);
          }
        }
      );
    }
  },
  async created() {
    Toast.loading({});
    const result = await getUserPhone();
    if (result.errorCode == 0) {
      this.phone = result.data.phone;
    }
    Toast.clear();
  }
};
</script>

<style scoped></style>
