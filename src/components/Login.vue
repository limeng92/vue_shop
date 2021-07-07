<template>
    <!-- 登录组件 -->
    <div class="login_container">
        <!-- 登录表单div -->
        <div class="login_box">
            <!-- 头像div -->
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!-- 表单元素区域 model表单数据绑定 rules表单验证规则 ref重置表单 -->
            <el-form label-width="0px"
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginFormRules"
            class="login_from"
            >
                <!-- 用户名 prop验证码规则 -->
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        placeholder="请输入用户名"
                        prefix-icon="iconfont icon-user">
                    </el-input>
                </el-form-item>
                <!-- 密码 prop验证码规则 -->
                <el-form-item prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        placeholder="请输入密码"
                        prefix-icon="iconfont icon-3702mima">
                    </el-input>
                </el-form-item>
                <!-- button -->
                <el-form-item  class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                     <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>
<script>
export default {
  // 定义数据值
  data () {
    return {
      // 表单数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  // 定义函数
  methods: {
    // 表单重置按钮
    resetLoginForm () {
      // resetFields方法：element-ui提供的重置表单方法，用来处理表单重置数据  console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登录的时候验证是否通过，通过就发起请求
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        // 如果验证通过了
        // this.$http.post('login', this.loginForm): 返回值为promise
        // 返回值为promise，可加await简化操作 相应的也要加async
        // {data:res} 这种写法是直接将返回的结果中将data拿出来赋值给res
        const { data: res } = await this.$http.post('/login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 1、将登陆成功之后的token, 保存到客户端的sessionStorage中; localStorage中是持久化的保存
        //   1.1 项目中出现了登录之外的其他API接口，必须在登陆之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2、通过编程式导航跳转到后台主页, 路由地址为：/home
        this.$router.push('/home')
      })
    }
  }

}
</script>
<style lang="less" scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius:3px;
        position:absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        // 头像样式
        .avatar_box{
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 1px solid #eee;
            }
        }
        //登录表单
        .login_from{
            width: 100%;
            position: absolute;
            bottom: 0%;//定位到底部
            padding: 0 20px;
            box-sizing: border-box;
        }
        //表单按钮
        .btns{
            display: flex;
            justify-content: flex-end;
        }
    }

</style>
