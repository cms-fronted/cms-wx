<template>
  <!-- 公告发布 -->
  <div class="flex-column felx-center" style="padding-bottom: 50px;">
    <!-- 公告内容 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div v-for="(item,index) in list" :key="index" style="border-bottom: 3px solid #CCCCCC;">
        <van-cell-group>
          <van-field
            style="padding: 5px 16px;"
            label-width="40px"
            v-model="item.title"
            label="标题:"
            size="small"
          ></van-field>
          <van-field
            label-width="40px"
            v-model="item.content"
            rows="5"
            autosize
            label="内容:"
            readonly
            type="textarea"
          />
          <div class="mAuthor flex-center">
            <p>{{item.create_time}}</p>
            <p>{{item.author}}</p>
            <van-button type="danger" size="mini" @click="delNotice(item,index)">删除</van-button>
          </div>
        </van-cell-group>
      </div>
      <!-- 			<van-divider :style="{ color: '#CCCCCC', borderColor: '#CCCCCC', padding: '0 16px' }">
				没有更多了
      </van-divider>-->
    </van-list>
    <!-- 发布新公告 -->
    <van-button
      style="position: fixed; bottom: 0;width: 100%;"
      icon="edit"
      type="info"
      size="large"
      to="/noticeEdit"
    >发公告</van-button>
  </div>
</template>

<script>
import { getNotice, deleteNotice } from "@/api/notice.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      total: 0,
      per_page: 6,
      current_page: 1,
      last_page: null,
      list: [], //公告列表
      loading: false, //组件加载标识
      finished: false //标识同上
    };
  },
  /* 
		 初始化数据
		 */
  async created() {
    Toast.loading({
      forbidClick: true,
      duration: 0
    });
    const result = await getNotice({
      page: this.current_page,
      size: this.per_page
    });
    if (result.errorCode == 0) {
      this.total = result.data.total;
      this.last_page = result.data.last_page;
      this.list = result.data.data;
    }
    Toast.clear();
  },
  methods: {
    /* 
			 删除评论
			 */
    async delNotice(e, index) {
      console.log(e);
      Toast.loading({
        message: "删除中...",
        forbidClick: true,
        duration: 0
      });
      // e.id
      const result = await deleteNotice({
        id: e.id
      });
      Toast.clear();
      if (result.errorCode == 0) {
        Toast.success("删除成功！");
        this.list.splice(index, 1);
      }
    },
    /* 
			 加载更多公告
			 */
    async onLoad() {
      //当前页与最后页相等 不加载
      if (this.last_page != null) {
        if (this.current_page == this.last_page) {
          this.finished = true;
        } else {
          this.current_page += 1;
          const result = await getNotice({
            page: this.current_page,
            size: this.per_page
          });
          if (result.errorCode == 0) {
            this.total = result.data.total;
            this.last_page = result.data.last_page;
            this.list = this.list.concat(result.data.data);
          }
        }
        this.loading = false;
      }
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.mAuthor {
  display: flex !important;
  flex-direction: row !important;
}

.mAuthor p {
  margin: 0 10px;
  font-size: 12px;
  color: #c8c9cc;
}
</style>
