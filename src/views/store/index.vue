<template>
  <!-- 小卖部 -->
  <div>
    <!-- 顶部购买方式&&按钮 -->
    <div
      class="flex-row"
      style="align-items: center;justify-content: space-around;padding: 15px 0;background-color: #F2F3F5;"
    >
      <div style="width: auto;" ref="info">
        <div class="flex-row" style="justify-content: space-around;">
          <h4 style="margin: 10px 0;">数量：{{ ccc }}</h4>
          <h4 style="margin: 10px 0;">金额：{{amount}}元</h4>
        </div>
        <van-radio-group
          v-model="distribution"
          class="flex-row felx-center"
          style="justify-content: space-around;"
        >
          <van-radio
            v-if="taking_mode == 1 || taking_mode == 3"
            style="margin-right: 10px;"
            name="1"
          >到店自提</van-radio>
          <van-radio v-if="taking_mode == 2 || taking_mode == 3" name="2">送货上门</van-radio>
        </van-radio-group>
      </div>
      <van-button type="info" @click="submitOrder">完成</van-button>
    </div>

    <van-divider
      v-if="goods.length==0"
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >暂无数据</van-divider>

    <!-- 菜品及数量选择 -->
    <div class="flex-row myscroll" :style="'height:'+scrollH+'px'">
      <!-- 左边随动菜单栏 -->
      <div class="category" ref="category">
        <ul>
          <li
            v-for="(item,index) in goods"
            :class="{active:currentIndex === index}"
            :key="index"
            @click="selectLeft(index)"
            ref="lItem"
          >{{item.name}}</li>
        </ul>
      </div>
      <!-- 右边菜品详情 -->
      <div class="footList" ref="footList">
        <ul>
          <li v-for="(items,index) in goods" :key="index" ref="rItem">
            {{items.name}}
            <div class="flex-row footDetail" style v-for="(item,key) in items.products" :key="key">
              <van-image :src="item.image" fit="contain" width="45%" />
              <div class="flex-column" style="justify-content: center;width: 55%">
                <div class="flex-row" style="justify-content: space-between;align-items: center;">
                  <p style="margin: 0 10px;">{{item.name}}</p>
                  <van-icon name="smile-o" size="25px" @click="openComment(item)" />
                </div>
                <p style="margin: 0 10px;">￥：{{item.price}}{{item.unit}}</p>
                <van-stepper
                  v-model="item.count"
                  min="0"
                  button-size="40px"
                  @change="onChange(item.count,item)"
                  @plus="addMealCount(item)"
                  @minus="reduceMealCount(item)"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 评论弹窗 -->
    <van-popup v-model="showComment" position="bottom" :style="{height:'70%'}">
      <!-- 商品评价 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :offset="100"
      >
        <div
          class="flex-row"
          style="justify-content: space-around;align-items: center;border-bottom: 1px solid #F2F3F5;"
        >
          <div>
            <p style="margin: 0;">{{productScore.taste}}</p>
            <p style="margin: 0;">商品评分</p>
          </div>
          <div>
            <div class="flex-row" style="align-items: center; margin: 5px;">
              <h4>质量</h4>
              <van-rate
                v-model="productScore.taste"
                :size="23"
                allow-half
                void-icon="star"
                readonly
                void-color="#eee"
              />
            </div>
            <div class="flex-row" style="align-items: center; margin: 5px;">
              <h4>服务</h4>
              <van-rate
                v-model="productScore.service"
                :size="23"
                allow-half
                void-icon="star"
                readonly
                void-color="#eee"
              />
            </div>
          </div>
          <div>
            <van-button @click="closeComment">关闭</van-button>
          </div>
        </div>
        <!-- 我的评价 -->
        <div class="flex-row" style="align-items: center; margin: 5px 5%;">
          <h4>质量</h4>
          <van-rate
            v-model="myComment.taste"
            :size="23"
            allow-half
            void-icon="star"
            void-color="#eee"
          />
        </div>
        <div class="flex-row" style="align-items: center; margin: 5px 5%;">
          <h4>服务</h4>
          <van-rate
            v-model="myComment.service"
            :size="23"
            allow-half
            void-icon="star"
            void-color="#eee"
          />
        </div>
        <van-cell-group style="width: 90%;margin: 5px 5%;">
          <van-field
            style="padding: 0; border:1px solid #CCCCCC;height: 100px;"
            input-align="left"
            v-model="myComment.remark"
            type="textarea"
            placeholder="请输入留言"
            autosize
            rows="2"
          />
        </van-cell-group>
        <div
          class="flex-row"
          style="justify-content: space-around;padding: 5px;border-bottom: 1px solid #F2F3F5;"
        >
          <van-button size="small" @click="showComment = false">取消</van-button>
          <van-button size="small" @click="submitComment">完成</van-button>
        </div>
        <!-- 更多评价 -->
        <div v-for="(item,index) in comment.data" :key="index">
          <p>鸡翅</p>
          <div class="flex-row" style="align-items: center; margin: 5px 5%;">
            <h4>质量</h4>
            <van-rate
              v-model="item.taste"
              :size="23"
              allow-half
              void-icon="star"
              void-color="#eee"
            />
          </div>
          <div class="flex-row" style="align-items: center; margin: 5px 5%;">
            <h4>服务</h4>
            <van-rate
              v-model="item.service"
              :size="23"
              allow-half
              void-icon="star"
              void-color="#eee"
            />
          </div>
          <van-cell-group>
            <van-field
              v-model="item.remark"
              label-width="50px"
              rows="1"
              autosize
              label="评论"
              type="textarea"
              readonly
            />
          </van-cell-group>
        </div>
      </van-list>
    </van-popup>
  </div>
</template>

<script>
import Bscroll from "better-scroll";
import { Toast } from "vant";
import {
  getShopList,
  getTakingMode,
  getComments,
  saveComment
} from "@/api/store.js";

export default {
  data() {
    return {
      taking_mode: null, //当前小卖部支持的取货方式  1｜到店取；2｜送货上门；3｜全部都显示
      distribution: "", //小卖部取货方式
      goods: [], //商品列表
      scrollH: "",
      scrollY: 0, //获取实时滚动位置
      heightList: [], //获取每一个li的高度
      comment: {}, //商品评论
      productScore: {}, //饭堂评论
      showComment: false, //显示评论
      myComment: {
        taste: 0,
        service: 0,
        remark: "",
        product_id: ""
      }, //我的评价
      count: 0,
      products: [], //已选商品列表
      isExist: false, //数量选择是否已在选择
      total: 0, //总数
      per_page: 6, //当前页码显示数量
      current_page: 1, //当前页
      last_page: 0, //最后一页
      loading: false, //加载logo显示
      finished: false
    };
  },
  methods: {
    //初始化 better-scroll
    _scrollInit() {
      //创建左边菜单栏滚动窗口
      this.category = new Bscroll(this.$refs.category, {
        click: true
      });
      //创建右边右边菜品滚动窗口
      this.footlist = new Bscroll(this.$refs.footList, {
        probeType: 3, //在 momentum 滚动动画运行过程中实时派发 scroll 事件
        click: true
      });
      this.footlist.on("scroll", pos => {
        //获取实时滚动的距离 使用scrollY接收
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    // 点击左菜单，同步又菜单
    selectLeft(index) {
      let rItem = this.$refs.rItem;
      let el = rItem[index];
      this.footlist.scrollToElement(el, 1000);
    },
    //获取li高度
    getHeight() {
      //获取每一个li的高度
      if (this.$refs.rItem) {
        const lis = this.$refs.rItem;
        //heightList的第一个元素为0
        let height = 0;
        this.heightList.push(height);
        //之后的高度即为当前li的高度加上之前面li的高度和
        lis.forEach(item => {
          height += item.clientHeight;
          this.heightList.push(height);
        });
      }
    },
    //关闭评论弹窗
    closeComment() {
      this.total = 0;
      this.current_page = 1;
      (this.last_page = 0), //最后一页
        (this.showComment = false);
    },
    //提交评论
    async submitComment() {
      //调用接口(小卖部评价 商品评价)
      const result = await saveComment({
        product_id: this.myComment.product_id,
        tase: this.myComment.taste,
        service: this.myComment.service,
        remark: this.myComment.remark
      });
      console.log(result);
      this.showComment = false;
      if (result.errorCode == 0) {
        this.myComment = {
          taste: 0,
          service: 0,
          remark: "",
          product_id: ""
        };
        Toast("提交成功");
      }
    },
    /*
			打开评论弹窗
			*/
    async openComment(e) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.myComment.product_id = e.id;
      //调用获取评论接口
      const result = await getComments({
        product_id: e.id,
        page: this.current_page,
        size: this.per_page
      });
      if (result.errorCode == 0) {
        this.total = result.data.comments.total;
        this.per_page = result.data.comments.per_page;
        this.last_page = result.data.comments.last_page;
        this.comment = result.data.comments;
        this.productScore = result.data.productScore;
      }
      this.showComment = true;
      Toast.clear();
    },
    /* 
			加载更多 
			 */
    async onLoad() {
      // 异步更新数据
      console.log(11231241234);
      console.log(this.last_page);
      console.log(this.current_page);
      // setTimeout(() => {
      if (this.last_page == this.current_page) {
        this.finished = true;
      }
      // 数据全部加载完成
      else {
        this.current_page = this.current_page + 1;
        const result = await getComments({
          product_id: this.myComment.product_id,
          page: this.current_page,
          size: this.per_page
        });
        console.log(result);
        this.total = result.data.comments.total;
        this.per_page = result.data.comments.per_page;
        this.last_page = result.data.comments.last_page;
        this.comment.data = this.comment.data.concat(result.data.comments.data);
        // this.productScore = result.data.productScore;
      }
      // 加载状态结束
      this.loading = false;
    },
    //提交订单
    submitOrder() {
      if (this.products.length == 0) {
        Toast.fail("请选择商品后在提交");
      } else if (this.distribution == "") {
        Toast.fail("请选择配送方式");
      } else {
        this.$router.push({
          name: "placeorder",
          params: {
            count: this.ccc,
            distribution: this.distribution,
            products: this.products,
            orderType: 3
          }
        });
      }
    },
    //添加已选商品列表
    addMealCount(e) {
      if (this.products.length != 0) {
        //若已选商品列表不为空
        this.products.forEach((item, index) => {
          if (item.id == e.id) {
            //已选商品列表里已存在所选商品
            this.products[index] = e;
            this.isExist = true;
          }
        });
        if (!this.isExist) {
          this.products.push(e);
        }
      } else {
        //已选商品列表为空
        this.products.push(e);
      }
      this.isExist = false;
    },
    //减少已选商品
    reduceMealCount(e) {
      this.products.forEach((item, index) => {
        if (item.count == 1 && item.id == e.id) {
          //若当前数量的值为0 删除元素
          this.products.splice(index, 1);
        } else if (item.id == e.id) {
          this.products[index] = Object.assign(this.products[index], e);
        }
      });
    },
    //手动输入商品数量
    onChange(count, e) {
      if (count == 0) {
        //若数值等于零 删除该已选商品
        this.products.forEach((item, index) => {
          if (item.id == e.id) {
            this.products.splice(index, 1);
          }
        });
      } else if (count > 0) {
        if (this.products.length > 0) {
          //如果存在已选商品 判断是否为选择过的商品
          this.products.forEach((item, index) => {
            if (item.id == e.id) {
              this.products[index] = e;
              this.isExist = true;
            }
          });
        }
        if (!this.isExist) {
          this.products.push(e);
        }
      }
      this.isExist = false;
    }
  },
  mounted() {
    setTimeout(() => {
      this.scrollH =
        window.innerHeight -
        (Math.abs(this.$refs.info.getBoundingClientRect().bottom) + 74);
    }, 200);
  },
  async created() {
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0
    });
    //获取小卖部提货方式
    const res = await getTakingMode();
    console.log('小卖部',res)
    //取货方式：1｜到店取；2｜送货上门；3｜全部都显示
    if (res.errorCode == 0 && res.data) {
      this.taking_mode = res.data.taking_mode;
    }
    //获取商品列表初始值
    const result = await getShopList();
    if (result.errorCode == 0) {
      result.data.forEach(items => {
        items.products.forEach(item => {
          item = Object.assign(item, {
            count: 0
          });
        });
      });
      this.goods = result.data;
    }

    //因为 _scrollInit函数需要操作DOM，因此必须在DOM元素存在文档中才能获取DOM节点
    //因此在 nextTick回调函数里面调用可以是实现此功能
    this.$nextTick(() => {
      this._scrollInit();
      this.getHeight();
    });
    Toast.clear();
  },
  computed: {
    //右菜单滚动 左菜单同步
    currentIndex() {
      const index = this.heightList.findIndex((item, index) => {
        return (
          this.scrollY >= this.heightList[index] &&
          this.scrollY < this.heightList[index + 1]
        );
      });
      return index > 0 ? index : 0;
    },
    ccc() {
      let sum = 0;
      this.products.forEach(item => {
        sum += parseInt(item.count);
      });
      return sum;
    },
    amount() {
      let sum = 0;
      this.products.forEach(item => {
        sum += parseFloat(item.price * item.count);
      });
      return sum;
    }
  }
};
</script>

<style scoped>
.category {
  width: 30%;
  line-height: 50px;
}

.category li {
  background-color: #f2f3f5;
}

.footList {
  width: 100%;
  padding: 0 10px;
}

.footList li {
  width: 100%;
}

.footList p {
  margin: 10px 10px;
  font-size: 14px;
  text-align: left;
}

/* 	.footList van-image {
		width: 45%;
		background-color: #07C160;
	} */

.footDetail {
  margin: 5px 0;
}

.active {
  background-color: #26a2ff !important;
  color: white !important;
}

h4 {
  margin: 0;
}
.myscroll {
  overflow: hidden;
  padding: 10px 0;
}
</style>
