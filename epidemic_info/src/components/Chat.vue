<template>
  <div class="com-container">
    <div class="chat-container">
      <p class="room-title">
        在線人數: {{ onlineCount }}人
        <span class="online-status"></span>
      </p>
      <ul ref="ul_ref">
        <li
          v-for="chat in chats"
          :key="chat + Math.random()"
          :class="{ 'my-chat': chat.isMyChat }"
        >
          {{ chat.content }}
          <span class="time-stamp">{{
            chat.username + ' - ' + chat.time
          }}</span>
        </li>
      </ul>
      <textarea
        cols="30"
        rows="10"
        ref="textarea_ref"
        @keyup.enter="inputText"
        v-model="textContent"
        placeholder="請輸入詢問內容, 輸入完點擊enter即可傳送訊息"
      ></textarea>
      <el-button
        @click="loginOut"
        class="logout-btn"
        type="danger"
        icon="el-icon-switch-button"
        plain
        >登出</el-button
      >
    </div>
  </div>
</template>

<script>
// 引入socket
import io from 'socket.io-client'
export default {
  // 組件內的路由攔截
  beforeRouteEnter(to, from, next) {
    // 未登入就移至登入頁面，有登入就放行
    if (!sessionStorage.getItem('isLogin')) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  },
  activated() {
    // 若在此頁面則不觸發收到消息後的紅點通知
    this.$emit('getNewMsg', false)
    // 進入頁面後自動聚焦於使用者名稱欄位  **直接在dom上使用autofocus無效
    this.$refs.textarea_ref.focus()
    // 訊息自動滾到底
    this.$refs.ul_ref.scrollTop = this.$refs.ul_ref.scrollHeight
  },
  mounted() {
    // 生成socket實例
    this.socket = io('http://localhost:7777')
    // 連接回調, 獲取連接id
    this.socket.on('connection', (id) => {
      this.socketId = id
    })
    // 收訊息時的回調
    this.socket.on('getMsg', (msgObj) => {
      this.chats.push({
        content: msgObj.content,
        username: msgObj.username,
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        isMyChat: msgObj.id === this.socketId ? true : false // 用id判斷是否為自己發出的訊息已確定渲染位置
      })
      this.$nextTick(() => {
        this.$refs.ul_ref.scrollTop = this.$refs.ul_ref.scrollHeight
      })
      // 判斷當前所在路由位置, 非chat的話則通知父組件啟用紅點通知功能
      if (this.$route.path != '/chat') {
        this.$emit('getNewMsg', true)
      }
    })
    // 更新在線人數的回調
    this.socket.on('getOnlineCount', (count) => {
      this.onlineCount = count
    })
  },
  data() {
    return {
      // socket實例
      socket: null,
      socketId: '',
      textContent: '',
      chats: [],
      onlineCount: 0
    }
  },
  methods: {
    // 登出事件
    loginOut() {
      sessionStorage.setItem('isLogin', '')
      this.socket.disconnect()
      this.$message.success('登出成功')
      this.$router.replace('/login')
      location.reload()
    },
    // 輸入事件
    inputText() {
      if (!this.textContent.trim()) {
        this.$message.warning('請輸入內容')
        this.textContent = ''
        return
      }
      this.socket.emit(
        'sendMsg',
        {
          content: this.textContent,
          id: this.socketId,
          username: sessionStorage.getItem('isLogin')
        },
        console.log('訊息已發送')
      )
      this.textContent = ''
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.com-container {
  padding-top: 4%;
}
.chat-container {
  width: 40%;
  min-width: 315px;
  height: 75%;
  margin: auto;
  background-color: #fef8ef;
  border-radius: 15px;
  border-end-start-radius: 0;
  border-end-end-radius: 0;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px black;
  textarea {
    width: 100%;
    height: 30%;
    padding: 10px;
    resize: none;
    border-radius: 15px;
    background-color: wheat;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 10px gray;
  }
  textarea:focus {
    outline: none;
  }
}
.room-title {
  padding-bottom: 10px;
  text-align: center;
  border-bottom: 1px solid #999;
  font-weight: 700;
  .online-status {
    display: inline-block;
    margin-left: 5px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: springgreen;
  }
}
ul {
  list-style-type: none;
  width: 100%;
  height: 70%;
  padding: 18px;
  border-radius: 15px;
  background-color: #fef8ef;
  margin-bottom: 5px;
  overflow: auto;
}
li {
  position: relative;
  width: 30%;
  height: auto;
  padding: 10px;
  margin: 0px 10px 25px 10px;
  background-color: white;
  border: 1px solid darkgray;
  border-radius: 15px;
  border-top-left-radius: 0px;
  clear: both;
  .time-stamp {
    font-size: 5px;
    position: absolute;
    top: -18px;
    left: 5px;
  }
}
.my-chat {
  float: right;
  clear: both;
  border-radius: 15px;
  border-top-right-radius: 0px;
  background-color: lightgreen;
}
.logout-btn {
  position: absolute;
  bottom: 20px;
  right: 40px;
  box-shadow: 0 0 15px black;
}
</style>