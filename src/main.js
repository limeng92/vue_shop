import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
// 配置接口根地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 挂在到Vue实例，设置axios挂着在vue的熟悉上，并定$http来挂载axios 后面可通过this.$http就可以调用axios
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
