<template>
    <el-container>
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/logo.png">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="loginout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 isCollapse为true就是折叠菜单栏，就缩小width的值  -->
            <el-aside :width="isCollapse ? '64px' :'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单栏区域
                    unique-opened每次只能点开一个菜单栏
                    collapse属性是element的属性，水平折叠菜单栏，点击的时候改变他的值，
                    collapse-transition也是element属性，意思是关闭折叠动画
                    router element中的属性，开启菜单栏的路由功能，并以菜单中index属性作为路由地址
                    default-active
                -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409FFF" unique-opened  :collapse="isCollapse" :collapse-transition="false" router>
                    <!-- 一级菜单  -->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                         <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <!-- 如果在class前面加冒号，来实现class的动态绑定，把自定义好的数据，通过循环的id来取数据绑定在class上 -->
                            <i :class="iconObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                         <!-- 二级菜单  :index 数据动态绑定，并设定唯一的id值，防止点击对应菜单全部一起展开 -->
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                             <!-- 二级菜单的模板区域 -->
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main><router-view></router-view></el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      // 自定义一级菜单所对应的小图标,然后通过在class前面加:冒号将此对象动态绑定到一级菜单的图标class属性上
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 默认不折叠
      isCollapse: false
    }
  },
  //   生命周期函数，就是在渲染成页面前执行
  created () {
    this.getMenuList()
  },
  methods: {
    // 退出登录
    loginout () {
      // 清空token 跳转到登录页
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取请求菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将结果集赋值给初始化的全局变量
      this.menuList = res.data
    //   console.log(res)
    },
    // 菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang="less" scoped>
.el-container{
    height:100%;

}
.el-header{
    background-color:#373f41;
    display:flex;
    justify-content:space-between;
    padding-left:0;
    align-items: center;
    color:#fff;
    > div{
        display:flex;
        align-items:center;
        img{
             height: 40px;
        }
        span{
            margin-left: 15px;
        }
    }
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: #eaedf1;
}
.iconfont{
    margin-right:10px
}
.toggle-button{
    background-color:#4A5064;
    text-align:center;
    color:#fff;
    cursor: pointer;
    letter-spacing: 0.2em;
    font-size: 10px;
    line-height: 24px;
}
</style>
