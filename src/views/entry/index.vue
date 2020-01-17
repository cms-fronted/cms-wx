<template>
  <div class="content">
    <img :src="bg" />
    <van-field
      v-model="phone"
      left-icon="phone-o"
      maxlength="11"
      center
      clearable
      placeholder="手机号码"
    >
      <van-button
        slot="button"
        size="small"
        type="info"
        :disabled="firstJump"
        @click="getCode"
      >获取验证码</van-button>
    </van-field>
    <p v-if="errorMsg" style=" width: 80%; color: red;text-align: left;">{{errorMsg}}</p>
    <p v-if="btntext != ''" style=" width: 80%; color: #CCCCCC;text-align: left;">{{btntext}}</p>
    <van-field v-model="smsCode" left-icon="qr" maxlength="5" center clearable placeholder="验证码" />
    <van-button class="mButton" type="info" size="large" @click="login">确认</van-button>
  </div>
</template>

<script>
import { getSmsCode, bindPhone } from "@/api/user.js";
import { Toast } from "vant";
import bgicon from "@/assets/u5178.png"
export default {
  data() {
    return {
      phone: "",
      smsCode: "",
      errorMsg: "",
      check: false, //信息校验
      firstJump: false,
      btntext: "",
      bg: bgicon
    };
  },
  methods: {
    async getCode() {
      // 校验手机号号码
      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(this.phone)) {
        this.errorMsg = "手机格式有误！";
        this.check = false;
      } else {
        this.firstJump = true;
        this.errorMsg = "";
        this.check = true;
        Toast.loading({
          duration: 0, //设置为0不取消展示
          mask: true,
          message: "获取验证码中..."
        });
        // 此处调用获取手机验证码接口
        const result = await getSmsCode({
          phone: this.phone
        });
        if (result.errorCode == 0) {
          Toast.success("验证码发送成功！");
          var coden = 60; // 定义60秒的倒计时
          var codeV = setInterval(() => {
            this.btntext = "请" + coden-- + "s后重新获取！";
            if (coden == -1) {
              // 清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
              clearInterval(codeV);
              this.firstJump = false;
              this.btntext = "";
            }
          }, 1000); //  1000是1秒
        } else {
          this.firstJump = false;
        }
      }
      Toast.clear();
    },
    async login() {
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        this.errorMsg = "手机格式有误！";
        return;
      }
      if (this.getSmsCode == "") {
        Toast.fail("请输入验证码");
        return;
      }
      Toast.loading({
        duration: 0, //设置为0不取消展示
        mask: true,
        message: "登录中..."
      });
      //调用检查验证码接口
      const result = await bindPhone({
        phone: this.phone,
        code: this.smsCode
      });
      if (result.errorCode == 0) {
        this.$router.push({
          name: "setting",
          params: {
            data: result.data
          }
        });
      }
      // this.$router.push({
      // 	name: 'setting',
      // 	params: {
      // 		data: [{
      // 				"id": 9,
      // 				"company_parent_id": 2,
      // 				"company_id": 3,
      // 				"company": "企业A",
      // 				"canteen_id": 6,
      // 				"canteen": "饭堂1"
      // 			},
      // 			{
      // 				"id": 10,
      // 				"company_parent_id": 0,
      // 				"company_id": 2,
      // 				"company": "一级企业",
      // 				"canteen_id": 1,
      // 				"canteen": "大饭堂"
      // 			},
      // 			{
      // 				"id": 21,
      // 				"company_parent_id": 0,
      // 				"company_id": 2,
      // 				"company": "一级企业",
      // 				"canteen_id": 1,
      // 				"canteen": "大饭堂"
      // 			}
      // 		]
      // 	}
      // });
      Toast.clear();
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  background-color: rgba(241, 249, 251);
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .van-field {
    margin-top: 40px;
    padding: 10px 5px;
    height: 52px;
    width: 80%;
    border-radius: 10px;
    border: 1px solid rgb(191 247 243);
  }
}

.mButton {
  margin: 40px 0 60px 0;
  width: 80%;
  border-radius: 5px;
}
</style>
