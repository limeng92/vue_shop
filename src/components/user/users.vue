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
                   <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
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
                    <template slot-scope="scope">
                        <!-- 修改按钮
                            size 属性用来控制按钮大小
                        -->
                        <el-button type="primary" icon="el-icon-edit" size=mini @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size=mini @click="removeUserById(scope.row.id)"></el-button>
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

        <!-- 添加用户区域 addDialogVisible用来控制显示和隐藏 close关闭时触发事件 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 添加用户表单区域 model表单数据绑定 rules表单验证规则 ref重置表单 -->
            <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户区域 -->
        <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editUserForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 自定义表单验证规则  rule 验证规则 value 验证的值 callback回调函数
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号规则
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
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
      PageLayerData: 'total, sizes, prev, pager, next, jumper',
      // 添加用户对话框 用来控制显示和隐藏
      addDialogVisible: false,
      // 添加用户数据绑定对象
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证
      addUserFormRules: {
        username: [{
          required: true, message: '请输入用户名', trigger: 'blur'
        }, {
          min: 2,
          max: 10,
          message: '用户名的长度在2～10个字',
          trigger: 'blur'
        }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, {
          min: 6,
          max: 15,
          message: '密码的长度在6～15个字',
          trigger: 'blur'
        }],
        email: [{
          required: true, message: '请输入邮箱', trigger: 'blur'
        }, {
          validator: checkEmail, trigger: 'blur'
        }],
        mobile: [{
          required: true, message: '请输入手机号', trigger: 'blur'
        }, {
          validator: checkMobile, trigger: 'blur'
        }]
      },
      editDialogVisible: false,
      // 根据id查询的用户信息
      editUserForm: {},
      // 修改用户信息时的表单验证
      editUserFormRules: {
        email: [{
          required: true, message: '请输入邮箱', trigger: 'blur'
        }, {
          validator: checkEmail, trigger: 'blur'
        }],
        mobile: [{
          required: true, message: '请输入手机号', trigger: 'blur'
        }, {
          validator: checkMobile, trigger: 'blur'
        }]
      }
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
    },
    // 表单重置事件
    addDialogClosed () {
      this.$refs.addUserFormRef.resetFields()
    },
    // 点击添加确认按钮时先来一个预校验然后再发起请求
    addUser () {
      this.$refs.addUserFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return false
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功！')
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        // 重新加载用户数据列表
        this.getUserList()
      })
    },
    // 修改用户信息
    async showEditDialog (id) {
      // 打开窗口需要根据id查询用户信息
      var url = '/users/' + id
      const { data: res } = await this.$http.get(url)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败！')
      // 将查询的数据赋值给初始化的修改表单对象
      this.editUserForm = res.data
      // 显示表单
      this.editDialogVisible = true
    },
    // 监听修改表单关闭事件
    editDialogClosed () {
      // 重置表单数据
      this.$refs.editUserFormRef.resetFields()
    },
    // 修改用户信息
    editUser () {
      // 提交请求前，表单预验证
      this.$refs.editUserFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        const { data: res } = await this.$http.put(
          'users/' + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('更新用户信息失败！')
        }
        // 隐藏添加用户对话框
        this.editDialogVisible = false
        this.$message.success('更新用户信息成功！')
        // 重新获取列表数据
        this.getUserList()
      })
    },
    // 删除按钮事件
    async removeUserById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => {
        return error
      })
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      //   console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 发起请求删除用户
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功！')
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scoped>

</style>
