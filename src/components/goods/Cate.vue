<template>
    <div class="">
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片区域 -->
        <el-card>
             <!-- 按钮区域 -->
            <el-row>
                <!-- 添加按钮区域 -->
               <el-col>
                   <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 使用刚刚在main.js中全局注册的tree-table依赖来创建树形结构
                data 是绑定数据分类数据对象
                column属性是定义每一列需要展示数据和文本
                show-index属性是否显示数据索引
                index-text属性数据索引名称
                selection-type 属性是否去掉复选框
                expand-type属性是否为展开行类型表格
                border 属性 添加纵向分割线
            -->
            <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" border :show-index="true" index-text="#">
                <!--是否有效那一栏作用域插槽，isOk是这一列的名称，在下面定义column对象中，已经声明。  -->
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success"  style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error"  style="color: red" v-else></i>
                </template>
                <!-- 排序那一栏的作用域插槽区域 -->
                <template slot="order" slot-scope="scope">
                    <el-tag   size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success"  size="mini"  v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning"  size="mini" v-else>三级</el-tag>
                </template>
                <!-- 操作那一栏的作用域插槽区域 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>

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
                :current-page="queyinfo.pagenum"
                :page-sizes="PageSelectedData"
                :page-size="queyinfo.pagesize"
                :layout="PageLayerData"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类 -->
        <el-dialog title="提示" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
                <!-- 添加分类联动展示区域
                      options 属性绑定着所有2级以上的分类数据
                      props 属性定义配置需要展示的数据字段对象
                      v-model 绑定着选中的分类父级Id数组
                      parentCateChanged 函数是，当选项发现改变时触发
                      clearable属性是指展示清除选择项属性按钮
                      filterable 是否允许搜索
                      change-on-select 属性 允许选择任一栏
                 -->
                <el-cascader
                    :options="parentCateList"
                    :props="cascaderProps"
                    v-model="selectedKeys"
                    @change="parentCateChanged" clearable filterable change-on-select>
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 编辑分类 -->
         <el-dialog title="提示" :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogClosed">
        <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="editCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
                <!-- 添加分类联动展示区域
                      options 属性绑定着所有2级以上的分类数据
                      props 属性定义配置需要展示的数据字段对象
                      v-model 绑定着选中的分类父级Id数组
                      parentCateChanged 函数是，当选项发现改变时触发
                      clearable属性是指展示清除选择项属性按钮
                      filterable 是否允许搜索
                      change-on-select 属性 允许选择任一栏
                 -->
                <el-cascader
                    :options="parentCateList"
                    :props="cascaderProps"
                    v-model="selectedKeys"
                    @change="editParentCateChanged" clearable filterable change-on-select>
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 查询分页条件
      queyinfo: {
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定每一列需要展示的数据和文本的定义
      //   是每页显示几条的select选项
      PageSelectedData: [1, 2, 5, 10, 20],
      //   是页码显示什么组件在页面上
      PageLayerData: 'total, sizes, prev, pager, next, jumper',
      // 为table指定每列显示的文本和字段名称已经作用域插槽名称
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将当前列定义为自定义模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          // 当前列 自定义模板
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 当前列 自定义模板
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'opt'
        }
      ],
      // 添加分类对话框显示隐藏
      addCateDialogVisible: false,
      // 添加分类对象
      addCateForm: {
        // 将要添加分类名称
        cat_name: '',
        // 分类父级id
        cat_pid: 0,
        // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象，用来配置需要展示的数据字段名
      cascaderProps: {
        // 配置触发选项,有两种 hover/click ，hover就是鼠标放上去就是触发显示
        expandTrigger: 'hover',
        value: 'cat_id', // 分类的id
        label: 'cat_name', // 分类名称
        children: 'children' // 用什么字段名来关联下级
      },
      // 选中的分类父级Id数组
      selectedKeys: [],
      // 修改分类对话框显示隐藏
      editCateDialogVisible: false,
      // 修改的分类对象
      editCateForm: {
        // 将要添加分类名称
        cat_name: '',
        // 分类父级id
        cat_pid: 0,
        // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queyinfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败!')
      // 把分类数据列表赋值给，初始化的分类变量对象
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听 pagesize改变的事件 每次改变需要重新请求接口
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queyinfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 页码值 改变事件 每次改变需要重新请求接口
    handleCurrentChange (newSize) {
      // console.log(newSize)
      this.queyinfo.pagenum = newSize
      this.getCateList()
    },
    // 添加分类按钮事件
    showAddCateDialog () {
      // 先获取父级分类数据
      this.getParentCateList()
      // 再打开对话框
      this.addCateDialogVisible = true
    },
    // 先获取父级分类数据 1和2级分类数据
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类列表数据失败!')
      this.parentCateList = res.data
    },
    // 添加分类窗口关闭事件
    addCateDialogClosed () {
      // 清空数据
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 添加分类 选择项发生变化时触发的事件 需要将数据重新绑定到表单对象上方便后面的数据操作
    parentCateChanged () {
      // 如何selectKeys 数组的长度>0 说明选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id 选择的父级id数组中的最后一个id数就是此次需要添加的分类的上级
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级 等级就是选中的父类的总长度个数
        this.addCateForm.cat_level = this.selectedKeys.length
        return 0
      } else {
        // 如果没有选择父级，就是需要添加顶级分类
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 当前分类的等级
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类对话框里的确认按钮事件
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        // 表单验证未通过
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 修改分类对话框关闭事件
    editCateDialogClosed () {
      // 清空数据
      this.$refs.editCateFormRef.resetFields()
      this.selectedKeys = []
      this.editCateForm.cat_pid = 0
      this.editCateForm.cat_level = 0
    },
    // 点击编辑分类按钮ID
    async showEditCateDialog (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
      this.editCateForm = res.data
      // 根据不同的等级获取需要被选中的父级id
      if (res.data.cat_level === 1) {
        this.selectedKeys = [res.data.cat_pid]
      } else if (res.data.cat_level === 2) {
        // 如果为第三级， 就需要拿到二级分类id去查他父亲id，放到选中的属性数组中
        const { data: pidres } = await this.$http.get('categories/' + res.data.cat_pid)
        this.selectedKeys = [pidres.data.cat_pid, res.data.cat_pid]
      }

      // 获取分类列表数据
      this.getParentCateList()

      this.editCateDialogVisible = true
    },
    // 当编辑分类框中的选择项发生变化时触发的事件 ，需要将数据重新绑定到表单对象上方便后面的修改
    editParentCateChanged () {
      // 如何selectKeys 数组的长度>0 说明选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id 选择的父级id数组中的最后一个id数就是此次需要添加的分类的上级
        this.editCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级 等级就是选中的父类的总长度个数
        this.editCateForm.cat_level = this.selectedKeys.length
        return 0
      } else {
        // 如果没有选择父级，就是需要添加顶级分类
        // 父级分类的Id
        this.editCateForm.cat_pid = 0
        // 当前分类的等级
        this.editCateForm.cat_level = 0
      }
    },
    // 修改分类提交表单
    // 因为为后端接口修改分类未能修改分类的父级，只能修改分类名称，故这里只修改分类名称this.editCateForm.cat_name
    // 如果能修改分类父级，因跟addCate方法一下，将this.editCateForm最为参数传递给后端修改。
    editCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id,
          {
            cat_name: this.editCateForm.cat_name
          })
        if (res.meta.status !== 200) return this.$message.error('更新分类名失败！')
        this.$message.success('更新分类名成功！')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    // 删除分类
    async removeCate (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') { return this.$message.info('已取消删除！') }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) { return this.$message.error('删除商品分类失败！') }
      this.$message.success('删除商品分类成功！')
      this.getCateList()
    }
  }

}
</script>
<style lang="less" scoped>
.treeTable{
    margin-top: 20px;
}
.el-cascader{
    width:100%;
}

</style>
