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

// 先在依赖中安装vue-table-with-tree-grid 然后再 导入vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'

// 配置接口根地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置请求拦截器，就是在所有请求只要使用了axios来请求接口，就先预处理一下，在请求headers中加入登录后的tokon令牌，用于后端验证token
axios.interceptors.request.use(config => {
  // console.log(config)
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// 挂在到Vue实例，设置axios挂着在vue的熟悉上，并定$http来挂载axios 后面可通过this.$http就可以调用axios
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 全局注册vue-table-with-tree-grid依赖
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
