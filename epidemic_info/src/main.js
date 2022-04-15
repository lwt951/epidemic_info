import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from 'echarts'
import { getData } from './utils/api.js'
import '../public/static/theme/vintage.js'
import './assets/css/global.scss'
import taiwanMap from '../public/static/map/taiwan.json'

Vue.use(ElementUI)
axios.defaults.baseURL = 'http://localhost:7777/api/'
// 註冊到原型上供vue實例使用
Vue.prototype.$getData = getData
Vue.prototype.$echarts = echarts

// 註冊地圖
echarts.registerMap('taiwan', taiwanMap)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
