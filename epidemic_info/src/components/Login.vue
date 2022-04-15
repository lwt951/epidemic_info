<template>
  <div class="login-box">
    <el-form
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      ref="loginForm"
    >
      <h2 class="login-title">用戶登入</h2>
      <el-form-item label="使用者名稱" prop="username">
        <el-input
          ref="username_ref"
          @keyup.enter.native="login"
          v-model="loginForm.username"
          placeholder="請輸入使用者名稱"
        ></el-input>
      </el-form-item>
      <el-form-item label="密碼" prop="password">
        <el-input
          @keyup.enter.native="login"
          v-model="loginForm.password"
          type="password"
          placeholder="請輸入密碼"
        ></el-input>
      </el-form-item>
      <el-button type="primary" class="login-button" @click="login"
        >登入</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  activated() {
    // 進入頁面後自動聚焦於使用者名稱欄位  **直接在dom上使用autofocus無效 
    this.$refs.username_ref.focus()
    // 登入後就無法再進入登入頁面
    if (sessionStorage.getItem('isLogin')) {
      this.$router.replace('/chat')
    }
  },
  data() {
    return {
      // 表單對象
      loginForm: {
        username: 'guest',
        password: '123456'
      },
      // 表單規則對象
      loginRules: {
        username: [
          { required: true, message: '請輸入使用者名稱', trigger: 'blur' },
          { validator: this.checkName, trigger: 'blur' } //驗證字符長度(含中英文)
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 5, max: 15, message: '長度在 5 至 15 個字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登入事件
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          sessionStorage.setItem('isLogin', this.loginForm.username)
          this.$message.success('登入成功')
          this.$router.push('/chat')
        } else {
          this.$message.error('請輸入正確使用者名稱及密碼')
        }
      })
    },
    // 自定中英字符長度驗證
    checkName(rule, value, callback) {
      let len = 0
      for (let i = 0; i < value.length; i++) {
        let c = value.charCodeAt(i)
        // 單字字節 + 1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++
        } else {
          len += 2
        }
      }
      if ((len < 2 && len > 0) || len > 6) {
        // 未過驗證提示
        callback(new Error('長度在 2 至 6 個字符，中文占兩個字符'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 20%;
  height: 330px;
  background-color: #fef8ef;
  border-radius: 15px;
  padding: 20px 35px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px black;
}
.login-button {
  width: 100%;
  margin-top: 5px;
}
.login-title {
  text-align: center;
  margin: 5px;
}
</style>