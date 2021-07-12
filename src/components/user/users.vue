<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- layout 布局 row 代表一行，col 代表一列
                span   属性就是占据多大的位置，一个row总共有24个占位
                gutter 是element中layout布局中属性，用来控制每一个col的之间间距
            -->
            <el-row :gutter="20">
                <!--
                    搜索 添加 v-model数据双向绑定到定义的初始化对象上，当输入框数据有所改变，都会传递到queyinfo对象想
                    当点击搜索按钮后，getUserList方法触发，并拿到传递数据后的queryInfo对象来进行查询数据
                    clearable 搜索input框可以删除按钮属性
                    clear事件就是删除按钮的事件监听
                -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加按钮区域 -->
               <el-col :span="4">
                   <el-button type="primary">添加</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域
                border 表格属性， 添加表格边框
                stripe 表格属性,  隔行变色的效果
            -->
            <el-table :data="userlist" border stripe>
                <!-- 数据列表区域
                    prop 用来给每一列填充数据，对应数据接口字段名即可
                    type 用来添加第一行的索引列
                -->
                <el-table-column type="index" label="#" ></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <!-- 作用域3插槽，里面的scope用来接受整表格每列的数据使用scope.row就可以将每一列的数据打印出来 -->
                    <template slot-scope="scope">
                        <!-- 来打印每一列所有数据 {{scope.row}} -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="">
                        <!-- 修改按钮
                            size 属性用来控制按钮大小
                        -->
                        <el-button type="primary" icon="el-icon-edit" size=mini></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size=mini></el-button>
                        <!--分配角色按钮
                            tooltip 按钮提示语
                            enterable element 属性，用来控制鼠标移开后提示语消失
                        -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size=mini></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
             <!-- 分页区域
                size-change 事件是，当切换每页显示多少条时触发
                current-change 事件是当我点击页码时触发
                page-sizes 是每页显示几条的select选项
                layout 是页码显示什么组件在页面上
                total 是数据总数
                current-page 当前页
                page-size 每页显示多少条
             -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="PageSelectedData"
                :page-size="queryInfo.pagesize"
                :layout="PageLayerData"
                :total="total">
            </el-pagination>
        </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      //   是每页显示几条的select选项
      PageSelectedData: [1, 2, 5, 10, 20],
      //   是页码显示什么组件在页面上
      PageLayerData: 'total, sizes, prev, pager, next, jumper'
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize改变的事件 每次改变需要重新请求接口
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变事件 每次改变需要重新请求接口
    handleCurrentChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagenum = newSize
      this.getUserList()
    },
    // 监听switch 开关的改变
    async userStateChanged (userinfo) {
      const url = `users/${userinfo.id}/state/${userinfo.mg_state}`
      const { data: res } = await this.$http.put(url)
      if (res.meta.status !== 200) {
        // 更细失败后，需要将页面的状态改变回来 取反则可以
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
