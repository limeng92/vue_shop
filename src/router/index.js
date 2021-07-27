import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')
const Users = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/power/Roles.vue')
const Cate = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/goods/Params.vue')
Vue.use(VueRouter)

const routes = [
  // 重定向
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    // 只要进入到/home路径就会从定向到/welcome路径下，加载子页面welcome页面,因为需要再home页面的主体部分展示子页面所以需要再home页面的主体块需要添加一个路由定位符来展示重定向的子页面
    redirect: '/welcome',
    children: [{ // 访问home路径加载子路径 children下面都是home的子路径，因为先加载home才能加载下面的子页面
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/categories',
      component: Cate
    }, {
      path: '/params',
      component: Params
    }]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
  // to 将要访问的路径 from 代表冲那个路径跳转而来 next是一个函数 表示放行
  // 访问登录页，放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
