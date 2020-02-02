<template>
  <!-- 确认下单 -->
  <div style="width: auto;text-align: left;padding: 0 15px;">
    <!-- <div @click="bindToModifyAddress" @click="showPop == true"> -->
    <div @click=" showPop = true" v-if="dining_mode ==2 || orderType == 4">
      <h3
        v-if="address.length==0"
        style="font-size: 16px;color: #BCBCBC;margin: 10px 0;"
      >你还没添加地址哦，请先添加收货地址</h3>
      <h3 v-else>{{def.address}}</h3>
      <van-icon style="margin-left: 90%;" name="arrow" />
      <p style="font-size: 12px;margin: 0;border-bottom:1px solid #CCCCCC;">
        {{def.name}}{{def.sex | sexFilter}}
        {{def.tel}}
      </p>
    </div>
    <!-- <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;" v-if="orderType ==1||orderType ==2">
			<h4>饭点时间送出</h4>
			<van-icon name="arrow" />
    </div>-->
    <p v-if="orderType!=4">订餐清单</p>
    <table style="width: 100%;text-align: center;" border="1" cellspacing="0" v-if="orderType!=4">
      <tr v-for="(item,key) in list" :key="key">
        <td width="40%">{{item.name}}</td>
        <td>{{item.count}}</td>
        <td>{{item.price * item.count}}元</td>
      </tr>
      <tr>
        <td>合计</td>
        <td></td>
        <td>{{sum}}元</td>
      </tr>
    </table>
    <div style="position: fixed;left: 10px;right: 10px; bottom: 20px;" v-if="orderType!=4">
      <van-button type="info" size="large" @click="submit">提交</van-button>
      <!-- <van-button style="margin-top: 10px;" type="info" size="large">微信结账</van-button> -->
    </div>
    <div style="position: fixed;left: 10px;right: 10px; bottom: 20px;" v-else>
      <van-button type="info" size="large" @click="changeAddress">修改</van-button>
    </div>
    <!-- 地址选择弹窗 -->
    <van-popup v-model="showPop" position="bottom">
      <van-address-list
        v-model="address_id"
        :list="address"
        @add="newAddressPop = true"
        @edit="bindToEditAddress"
        @select="selectAddress"
      />
    </van-popup>
    <!-- 新增地址弹窗 -->
    <van-popup v-model="newAddressPop" position="bottom">
      <div class="flex-row address">
        <van-button
          style="position: fixed;left: 10px;"
          size="small"
          @click="this.newAddressPop = false"
        >取消</van-button>
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
    </van-popup>
    <!-- 编辑地址弹窗 -->
    <van-popup v-model="editAddressPop" position="bottom">
      <div class="flex-row address">
        <van-button
          style="position: fixed;left: 10px;"
          size="small"
          @click="editAddressPop = false"
        >取消</van-button>
        <h4 style="width: 100%; margin: 15px 0;">修改送餐地址</h4>
      </div>
      <van-address-edit
        :area-list="areaList"
        show-search-result
        area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="editOnSave"
        :is-saving="editIsSaving"
        :address-info="addressInfo"
      >
        <van-radio-group
          class="flex-row flex-center"
          style="justify-content: space-around;padding:10px 16px;"
          v-model="addressInfo.sex"
        >
          <van-radio name="2">女士</van-radio>
          <van-radio name="1">先生</van-radio>
        </van-radio-group>
      </van-address-edit>
    </van-popup>
  </div>
</template>

<script>
import {
  getUserAddress,
  addUserAddress,
  updateUserAddress
} from "@/api/user.js";
import { addShopOrder } from "@/api/store.js";
import { saveOrder, changeFoods, changeOrderAddress } from "@/api/selfDish.js";
import { Toast } from "vant";
import area from "@/utils/area.js";

export default {
  data() {
    return {
      address: [], //收货地址
      def: {}, //页面显示的地址（初始为默认地址）,
      list: [], //订单清单
      sum: 0, //清单合计
      orderType: null, //订单类型 3:小卖部 4:地址修改
      shop: {
        //小卖部商品列表
        count: null //数量
      },
      showPop: false, //展示地址选择弹窗
      address_id: "", //地址选择id
      selfDish: {}, //个人选菜商品列表
      dining_mode: "", //配送方式1｜食堂；2｜外卖；3｜全部

      newAddressPop: false, //新增地址弹窗标识
      sex: "", //性别
      areaList: area, //地区选择列表
      isSaving: false, //保存按钮加载动画

      editAddressPop: false, //编辑地址弹窗标识
      addressInfo: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        sex: "" //性别
      }, //选中地址//编辑地址初始信息
      editIsSaving: false //加载动画
    };
  },
  methods: {
    //保存新增地址
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
          //新增成功 重新获取用户地址
          const result = await getUserAddress();
          if (result.errorCode == 0) {
            result.data.forEach((item, index) => {
              item = Object.assign(item, {
                tel: item.phone
              });
            });
            this.address = result.data;
            this.newAddressPop = false;
          }
        }
      }
    },
    // bindToModifyAddress() {
    //   this.$router.push({
    //     path: "/modifyaddress"
    //   });
    // },
    //订单提交
    async submit() {
      if (this.orderType == 3) {
        //若订单类型为小卖部
        if (this.def.id != "") {
          //若取货方式为送货上门
          Toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0
          });
          var arry = new Array();
          for (var i = 0; i < this.shop.products.length; i++) {
            arry[i] = {
              product_id: this.shop.products[i].id,
              name: this.shop.products[i].name,
              price: this.shop.products[i].price,
              unit: this.shop.products[i].unit,
              count: this.shop.products[i].count
            };
          }
          var data = {};
          if (this.dining_mode == 1) {
            data = {
              count: this.shop.count,
              distribution: this.shop.distribution,
              address_id: "",
              products: JSON.stringify(arry)
            };
          } else {
            data = {
              count: this.shop.count,
              distribution: this.shop.distribution,
              address_id: this.def.id,
              products: JSON.stringify(arry)
            };
          }
          const result = await addShopOrder(data);
          Toast.clear();
          if (result.errorCode == 0) {
            //提交成功
            Toast("下单成功！");
            this.$router.push("/");
          }
        } else {
          //如果该用户还没地址
          Toast.fail("请选择地址！");
        }
      } else if (this.orderType == 1) {
        //个人选菜订单
        this.selfDish.detail = JSON.stringify(this.selfDish.detail);
        if (this.dining_mode == 2) {
          const data = Object.assign(this.selfDish, {
            address_id: this.address_id,
            detail: this.selfDish.detail
          });
          const result2 = await saveOrder(data);
          if (result2.errorCode == 0) {
            Toast.success("下单成功！");
            this.$router.push({
              path: "/"
            });
          }
        } else {
          const data = Object.assign(this.selfDish, {
            address_id: "",
            detail: this.selfDish.detail
          });
          const result2 = await saveOrder(data);
          if (result2.errorCode == 0) {
            Toast.success("下单成功！");
            this.$router.push({
              path: "/"
            });
          }
        }
      }
    },
    //编辑地址
    bindToEditAddress(e) {
      //遍历出地区编码
      Object.keys(area.county_list).forEach(key => {
        if (area.county_list[key] == e.area) {
          this.addressInfo.areaCode = key;
        }
      });
      //初始化页面的值
      this.addressInfo = Object.assign(this.addressInfo, {
        id: e.id,
        name: e.name,
        tel: e.tel,
        province: e.province,
        city: e.city,
        county: e.area,
        addressDetail: e.address,
        sex: e.sex.toString()
      });
      this.editAddressPop = true;
    },
    //保存编辑地址
    async editOnSave(content) {
      this.editIsSaving = true;
      const data = {
        id: this.addressInfo.id,
        province: content.province,
        city: content.city,
        area: content.county,
        address: content.addressDetail,
        name: content.name,
        phone: content.tel,
        sex: this.addressInfo.sex
      };
      //调用修改地址接口
      const result = await updateUserAddress(data);
      if (result.errorCode == 0) {
        //修改成功
        //重新获取用户地址
        const result = await getUserAddress();
        if (result.errorCode == 0) {
          result.data.forEach((item, index) => {
            item = Object.assign(item, {
              tel: item.phone
            });
          });
          this.address = result.data;
          this.editAddressPop = false;
        }
      }
      this.editIsSaving = false;
    },
    //选择地址
    selectAddress(e) {
      this.def = e;
      this.showPop = false;
    },
    //修改地址
    async changeAddress() {
      Toast.loading({
        forbidClick: true,
        duration: 0
      });
      const result = await changeOrderAddress({
        order_id: this.$route.params.orderDetail.id,
        address_id: this.address_id
      });
      if (result.errorCode == 0) {
        Toast.success("修改成功！");
        this.$router.push("/");
      }
      setTimeout(() => {
        Toast.clear();
      }, 1500);
    }
  },
  filters: {
    sexFilter(value) {
      if (value == 1) {
        return "（先生）";
      } else if (value == 0) {
        return "（女士）";
      }
      return "";
    }
  },
  async created() {
    Toast.loading({
      forbidClick: true,
      duration: 0
    });
    const data = this.$route.params;
    //调用获取用户地址接口
    const result = await getUserAddress();
    if (result.errorCode == 0) {
      result.data.forEach((item, index) => {
        item = Object.assign(item, {
          tel: item.phone
        });
      });
      this.address = result.data;
    }
    if (data.orderDetail) {
      //修改订单地址
      this.orderType = data.orderType;

      this.address.forEach((value, index) => {
        if (value.id == data.orderDetail.address_id) {
          this.def = value;
        }
        //按照组件格式设置属性
        this.address[index] = Object.assign(value, {
          tel: value.tel
        });
      });
      Toast.clear();
      return;
    } else if (data.orderType == 3) {
      //若为小卖部订单
      this.orderType = data.orderType;
      this.shop = data;
      this.list = data.products;
      this.dining_mode = data.distribution;
      this.list.forEach((item, index) => {
        this.sum += item.count * item.price;
      });
    } else if (data.orderType == 1) {
      //若为个人选菜订单
      this.orderType = data.orderType;
      this.dining_mode = data.dining_mode;
      this.selfDish = data;
      //处理展示数据的结构 及 总计
      data.detail.forEach((items, index) => {
        items.foods.forEach((item, key) => {
          this.list.push(item);
          this.sum += item.count * item.price;
        });
      });
    }
    //将默认地址提取出来
    this.address.forEach((value, index) => {
      if (value.default == 1) {
        this.address_id = value.id;
        this.def = value;
      }
      //按照组件格式设置属性
      this.address[index] = Object.assign(value, {
        tel: value.tel
      });
    });
    Toast.clear();
  }
};
</script>

<style scoped>
.address {
  text-align: center;
  align-items: center;
  border-bottom: 1px solid #f2f3f5;
}
</style>
