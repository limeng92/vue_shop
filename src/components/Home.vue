<template>
    <div class="">
            <!-- home组件 -->
            <el-button type="info" @click="loginout">退出</el-button>
    </div>
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

</style>
