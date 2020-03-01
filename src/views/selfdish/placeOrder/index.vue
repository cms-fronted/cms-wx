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
      <tr>
        <td>名称</td>
        <td>份数</td>
        <td>数量</td>
        <td>金额</td>
      </tr>
      <tr v-for="(item,key) in list" :key="key">
        <td width="40%">{{item.name}}</td>
        <td>{{count}}</td>
        <td>{{item.count}}</td>
        <td>{{(item.price * item.count*count).toFixed(2)}}元</td>
      </tr>
      <tr v-if="dining_mode ==2 || orderType == 4">
        <td>配送费</td>
        <td></td>
        <td></td>
        <td>{{delivery_fee}}元</td>
      </tr>
      <tr>
        <td>合计</td>
        <td></td>
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
        @add="addAddress"
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
          @click="newAddressPop = false"
        >取消</van-button>
        <h4 style="width: 100%; margin: 15px 0;">新增送餐地址</h4>
      </div>
      <van-address-edit
        :area-list="areaList"
        show-search-result
        @save="onSave"
        :is-saving="isSaving"
      >
        <van-radio-group
          slot="default"
          class="flex-row flex-center"
          style="justify-content: space-around;padding:10px 16px;"
          v-model="sex"
        >
          <van-radio name="2">女士</van-radio>
          <van-radio name="1">先生</van-radio>
        </van-radio-group>
      </van-address-edit>
    </van-popup>
    <!-- 有限制新增地址弹窗 -->
    <van-popup v-model="newLimitAddressPop" position="bottom">
      <div class="flex-row address">
        <van-button
          style="position: fixed;left: 10px;"
          size="small"
          @click="newLimitAddressPop = false"
        >取消</van-button>
        <h4 style="width: 100%; margin: 15px 0;">新增送餐地址</h4>
      </div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="username"
          label="姓名"
          placeholder="收货人姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field
          v-model="tel"
          type="tel"
          name="tel"
          label="电话"
          placeholder="收货人手机号"
          :rules="[{ pattern, message: '请填写手机号' }]"
        />
        <van-field
          readonly
          clickable
          name="area"
          :value="value"
          label="可选区域"
          placeholder="点击选择区域"
          @click="showPicker = true"
          slot="default"
          :rules="[{ required: true, message: '请选择区域' }]"
        />
        <van-field
          slot="default"
          name="detail"
          v-model="text"
          label="详细地址"
          placeholder="街道门牌、楼层房间号等信息"
          :rules="[{ required: true, message: '请填写门牌号' }]"
        />
        <van-field name="sex" label="性别">
          <template #input>
            <van-radio-group v-model="sex" direction="horizontal">
              <van-radio name="1">先生</van-radio>
              <van-radio name="2">女士</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button round block type="danger" native-type="submit">提交</van-button>
        </div>
      </van-form>
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
    <!-- 编辑有限制地址 -->
    <van-popup v-model="editLimitAddressPop" position="bottom">
      <div class="flex-row address">
        <van-button
          style="position: fixed;left: 10px;"
          size="small"
          @click="editLimitAddressPop = false"
        >取消</van-button>
        <h4 style="width: 100%; margin: 15px 0;">修改送餐地址</h4>
      </div>
      <van-form @submit="submitEidtLimit">
        <van-field
          v-model="limitAddressInfo.name"
          name="username"
          label="姓名"
          placeholder="收货人姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field
          v-model="limitAddressInfo.tel"
          type="tel"
          name="tel"
          label="电话"
          placeholder="收货人手机号"
          :rules="[{ pattern, message: '请填写手机号' }]"
        />
        <van-field
          readonly
          clickable
          name="area"
          :value="value"
          label="可选区域"
          placeholder="点击选择区域"
          @click="showPicker = true"
          slot="default"
          :rules="[{ required: true, message: '请选择区域' }]"
        />
        <van-field
          slot="default"
          name="detail"
          v-model="text"
          label="详细地址"
          placeholder="街道门牌、楼层房间号等信息"
          :rules="[{ required: true, message: '请填写门牌号' }]"
        />
        <van-field name="sex" label="性别">
          <template #input>
            <van-radio-group v-model="limitAddressInfo.sex" direction="horizontal">
              <van-radio name="1">先生</van-radio>
              <van-radio name="2">女士</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button round block type="danger" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </van-popup>
    <!-- 有限制地址选择 -->
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        value-key="name"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
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
import {
  saveOrder,
  changeFoods,
  changeOrderAddress,
  personChoice
} from "@/api/selfDish.js";
import { Toast } from "vant";
import area from "@/utils/area.js";

export default {
  data() {
    return {
      address: [], //收货地址
      def: {}, //页面显示的地址（初始为默认地址）
      limit: null, //地址限制
      limit_address: [], //地址限制列表
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
      sex: "1", //性别
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
      editIsSaving: false, //加载动画

      // 限制地址
      showPicker: false,
      columns: [],
      value: "",
      text: "",
      newLimitAddressPop: false,
      username: "",
      tel: "",
      pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,

      editLimitAddressPop: false,
      limitAddressInfo: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        area: "",
        detail: "",
        sex: "" //性别
      }, //选中地址//编辑地址初始信息
      delivery_fee: "" //配送费
    };
  },
  methods: {
    addAddress() {
      if (this.isLimit) {
        this.newLimitAddressPop = true;
      } else {
        this.newAddressPop = true;
      }
    },
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
          this.addressInit();
          this.newAddressPop = false;
        }
      }
    },
    //保存限制新增地址
    async onSubmit(values) {
      let data = {};
      this.limit_address.forEach((item, index) => {
        if (item.id == this.address_id) {
          data = {
            province: item.province,
            city: item.city,
            area: item.area,
            address: item.address + this.text,
            name: values.username,
            phone: values.tel,
            sex: values.sex
          };
        }
      });
      const result = await addUserAddress(data);
      if (result.errorCode == 0) {
        //新增成功 重新获取用户地址
        this.addressInit();
        this.newLimitAddressPop = false;
      }
    },
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
      } else if (
        this.orderType == 1 &&
        localStorage.getItem("out_siders" == 2)
      ) {
        //个人选菜订单--企业人员  
        this.selfDish.detail = JSON.stringify(this.selfDish.detail);
        if (this.dining_mode == 2) {  //外卖订餐
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
        } else { //堂食
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
      } else if (
        this.orderType == 1 &&
        localStorage.getItem("out_siders") == 1
      ) {
        // 个人选菜订单--外部人员订餐
        this.selfDish.detail = JSON.stringify(this.selfDish.detail);
        if (this.dining_mode == 2) {//外卖
          const data = Object.assign(this.selfDish, {
            address_id: this.address_id,
            detail: this.selfDish.detail
          });
          const result2 = await personChoice(data);
          if (result2.errorCode == 0) {
            Toast.success("下单成功！");
            this.$router.push({
              path: "/"
            });
          }
        } else {//堂食
          const data = Object.assign(this.selfDish, {
            address_id: "",
            detail: this.selfDish.detail
          });
          const result2 = await personChoice(data);
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
      if (this.isLimit) {
        console.log(e);
        this.limitAddressInfo = {
          id: e.id,
          name: e.name,
          tel: e.tel,
          province: e.province,
          city: e.city,
          area: e.area,
          detail: e.address,
          sex: e.sex.toString()
        };
        this.editLimitAddressPop = true;
      } else {
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
      }
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
        this.addressInit();
        this.editAddressPop = false;
      }
      this.editIsSaving = false;
    },
    //保存编辑限制地址
    async submitEidtLimit(values) {
      let data = {};
      this.limit_address.forEach((item, index) => {
        if (item.id == this.address_id) {
          data = {
            id: this.limitAddressInfo.id,
            province: item.province,
            city: item.city,
            area: item.area,
            address: item.address + values.detail,
            name: values.username,
            phone: values.tel,
            sex: values.sex
          };
        }
      });
      this.editIsSaving = true;
      // 调用修改地址接口
      const result = await updateUserAddress(data);
      if (result.errorCode == 0) {
        //修改成功
        //重新获取用户地址
        this.addressInit();
        this.editLimitAddressPop = false;
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
    },
    // 初始化地址地址
    async addressInit() {
      const result = await getUserAddress();
      console.log(result);
      if (result.errorCode == 0 && result.data.limit == 1) {
        // 地址有限制
        this.limit = 1;
        this.limit_address = result.data.limit_address;
        if (this.columns.length == 0) {
          result.data.limit_address.forEach((item, index) => {
            let str = item.province + item.city + item.area + item.address;
            this.columns.push({ name: str, id: item.id });
          });
        } else {
          result.data.limit_address.forEach((items, index) => {
            let isExist = false;
            this.columns.forEach((item, key) => {
              if (items.id == item.id) {
                isExist = true;
              }
            });
            if (!isExist) {
              let str = item.province + item.city + item.area + item.address;
              this.columns.push({ name: str, id: item.id });
            }
            isExist = false;
          });
        }

        let list = [];
        result.data.user_address.forEach((item, index) => {
          item = Object.assign(item, {
            tel: item.phone
          });
          if (item.use == 1) {
            list.push(item);
          }
        });
        this.address = list;
      } else if (result.errorCode == 0 && result.data.limit == 2) {
        //地址无限制
        this.limit = 2;
        this.limit_address = result.data.limit_address;
        result.data.user_address.forEach((item, index) => {
          item = Object.assign(item, {
            tel: item.phone
          });
        });
        this.address = result.data.user_address;
      }
      this.delivery_fee = result.data.delivery_fee;
    },
    onConfirm(value) {
      this.value = value.name;
      this.address_id = value.id;
      this.showPicker = false;
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
    await this.addressInit();
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
      this.count = data.count;
      this.list.forEach((item, index) => {
        this.sum += item.count * item.price * data.count;
      });
      this.sum += this.delivery_fee;
    } else if (data.orderType == 1) {
      //若为个人选菜订单
      this.orderType = data.orderType;
      this.dining_mode = data.dining_mode;
      this.selfDish = data;
      this.count = data.count;
      //处理展示数据的结构 及 总计
      data.detail.forEach((items, index) => {
        items.foods.forEach((item, key) => {
          this.list.push(item);
          this.sum += item.count * item.price * data.count;
        });
      });
      this.sum += this.delivery_fee;
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
    if(localStorage.getItem('out_siders')==1){
      this.dining_mode = 2;
    }
    Toast.clear();
  },
  computed: {
    isLimit() {
      if (this.limit == 1) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style scoped>
.address {
  text-align: center;
  align-items: center;
  border-bottom: 1px solid #f2f3f5;
}
.van-cell__value--alone {
  text-align: left !important;
}
</style>
