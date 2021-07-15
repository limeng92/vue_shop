<template>
    <div>
          <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 按钮区域 -->
            <el-row>
                <!-- 添加按钮区域 -->
               <el-col>
                   <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 展开列 绑定class样式，展示边框线 -->
                        <el-row :class="['bdbottom', i1===0 ? 'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!-- 一级权限展示 -->
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级和第三级展示 -->
                            <el-col :span="19">
                                <!-- 渲染二级和三级区域 通过三元表达排除不需要边框线的区域 -->
                                <el-row :class="[i2===0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <!-- 二级渲染区域 -->
                                    <el-col :span="6">
                                        <el-tag type="success" closable>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级渲染区域 -->
                                    <el-col :span="18">
                                        <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size=mini  @click="showEditDialog(scope.row.id)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size=mini @click="removeRoleById(scope.row.id)">删除</el-button>
                            <el-button type="warning" icon="el-icon-setting" size=mini>分配权限</el-button>
                        </template>
                    </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色区域 addDialogVisible用来控制显示和隐藏 close关闭时触发事件 -->
        <el-dialog title="添加用户" :visible.sync="addRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
            <!-- 添加用户表单区域 model表单数据绑定 rules表单验证规则 ref重置表单 -->
            <el-form :model="addRoleForm" :rules="RoleFormRules" ref="RoleFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色对话框 -->
        <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
        <el-form :model="editRoleForm" ref="RoleFormRef" :rules="RoleFormRules" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
  data () {
    return {
    // 角色列表数据
      rolesList: [],
      // 添加表单显示隐藏
      addRoleDialogVisible: false,
      // 编辑表单显示隐藏
      editRoleDialogVisible: false,
      // 添加角色表单对象数据
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色表单对象数据
      editRoleForm: {},
      // 添加角色表单验证规则
      RoleFormRules: {
        roleName: [{
          required: true, message: '请输入角色名称', trigger: 'blur'
        }, {
          min: 2,
          max: 10,
          message: '角色的长度在2～10个字',
          trigger: 'blur'
        }],
        roleDesc: [{
          required: true, message: '请输入角色描述', trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '角色的长度在2～20个字',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    // 角色列表数据请求方法
    this.getRolesList()
  },
  methods: {
    // 角色列表数据请求方法
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
    },
    // Tag标签删除权限方法
    async removeRightById (role, rightId) {
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
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      // 如果重新调用 this.getRolesList()方法，获取列表最新数据，页面会刷新展开列会闭合 防止页面从新刷新，就是用直接给对象赋值返回的结果集即可
      //   this.getRolesList()
      role.children = res.data
      this.$message.success('删除权限成功！')
    },
    // 添加表单关闭事件
    addRoleDialogClosed () {
      // 重置表单数据
      this.$refs.RoleFormRef.resetFields()
    },
    // 添加角色确认按钮事件
    addRole () {
      this.$refs.RoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.addRoleDialogVisible = false
        // 重新获取表单数据
        this.getRolesList()
      })
    },
    // 编辑按钮事件,并查询单条数据
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
      // 将查询的数据塞给编辑表单对象数据
      this.editRoleForm = res.data
      // 开启弹框
      this.editRoleDialogVisible = true
    },
    // 修改角色提交表单事件
    editRoles () {
      this.$refs.RoleFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('更新角色信息失败！')
        }
        // 隐藏编辑角色对话框
        this.editRoleDialogVisible = false
        this.$message.success('更新角色信息成功！')
        this.getRolesList()
      })
    },
    // 删除角色
    async removeRoleById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
      this.$message.success('删除用户成功！')
      this.getRolesList()
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
