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
            <!-- 侧边栏 -->
            <el-aside width="200px">
                <!-- 侧边栏菜单栏区域 -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
                    <!-- 一级菜单  -->
                    <el-submenu index="1">
                         <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>主菜单</span>
                        </template>
                         <!-- 二级菜单 -->
                        <el-menu-item index="1-3">
                             <!-- 二级菜单的模板区域 -->
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>子菜单</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
  methods: {
    // 退出登录
    loginout () {
      // 清空token 跳转到登录页
      window.sessionStorage.clear()
      this.$router.push('/login')
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
}
.el-main{
    background-color: #eaedf1;
}
</style>
