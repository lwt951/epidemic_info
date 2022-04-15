<template>
  <div>
    <el-container>
      <el-header>
        <div class="logo">
          <img src="../assets/logo.png" alt="" />
        </div>
        <el-menu
          :default-active="defaultActiveValue"
          text-color="#999"
          active-text-color="#9ae17b"
          mode="horizontal"
          background-color="rgba($color: #000000, $alpha: 0.7)"
          :router="true"
        >
          <el-menu-item index="map">
            <i class="el-icon-location-information"></i>
            流感分布</el-menu-item
          >
          <el-menu-item index="line">
            <i class="el-icon-data-line"></i>
            流感趨勢</el-menu-item
          >
          <el-menu-item index="pie">
            <i class="el-icon-pie-chart"></i>
            流感分析</el-menu-item
          >
          <el-menu-item index="bar">
            <i class="el-icon-s-data"></i>
            疫苗情形</el-menu-item
          >
          <el-menu-item index="chat">
            <i class="el-icon-chat-dot-square"></i>
            病情交流
            <span :class="{'new-msg':($route.path != '/chat') && hasNewMsg}"></span>
            </el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-main>
          <transition name="el-fade-in" class="transition-box">
            <keep-alive>            
              <router-view class="box" @getNewMsg="getNewMsg"></router-view> 
            </keep-alive>
          </transition>
        </el-main>
      </el-container>
      <p style="color:white;fontSize:8px;fontWeight:900">※以上皆為虛構資料，與現實無任何關聯</p>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 判斷是否觸發收訊息時的紅點訊息通知
      hasNewMsg: false
    }
  },
  computed: {
    // 判斷當前路由高亮狀態
    defaultActiveValue() {
      return this.$route.name.toLowerCase()
    }
  },
  methods: {
    // 有新訊息事件
    getNewMsg(status) {
      this.hasNewMsg = status
    }
  }
}
</script>
<style lang="scss" scoped>
$color1: #9ae17b;
$color2: #307470;

.el-container {
  height: 100%;
  position: relative;
}
.el-header {
  padding: 0;
  width: 100%;
  height: 120px !important;
  background-color: rgba($color: #000000, $alpha: 0.7);
  .logo {
    padding-top: 0.5%;
    text-align: center;
    width: 100%;
    height: 40%;
    color: #fff;
    img {
      height: 100%;
    }
  }
  .el-menu {
    border: none !important;
    background-color: transparent;
    display: flex;
    justify-content: space-around;
    margin: 0 auto;
    width: 60%;
    height: 100%;
    .el-menu-item {
      margin: 10px;
      text-align: center;
      font-size: 15px;
      font-weight: 600;
      border: none !important;
      border-radius: 30px;
      background-color: transparent !important;
      &:hover {
        background-color: transparent !important;
      }
      &:focus {
        background-color: transparent !important;
      }
    }
  }
}
.el-main {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.new-msg {
    display: inline-block;
    margin-left: 3px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color:orangered;
  }
  .transition-box {
    position: relative;
  }
  .box {
    position: absolute;
  }
</style>