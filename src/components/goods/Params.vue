<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 头部警告区域 closable关闭叉号按钮  show-icon在提示标语钱加一个感叹号-->
             <el-alert title="注意:只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 商品分类的级联选择框
                        options 属性绑定着所有2级以上的分类数据
                        props 属性定义配置需要展示的数据字段对象
                        v-model 绑定着选中的分类父级Id数组
                        handleChange 函数是，当选项发现改变时触发
                        clearable属性是指展示清除选择项属性按钮
                        filterable 是否允许搜索
                    -->
                    <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange" clearable filterable></el-cascader>
                </el-col>
            </el-row>
            <!-- tab 页签区域 选项卡 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                 <!-- 添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                  <!-- 添加动态参数按钮 -->
                  <el-button type="primary" size="mini" :disabled="isBtnDisabled"  @click="addDialogVisible = true">添加参数</el-button>
                  <!-- 动态参数表格 -->
                  <el-table :data="manyTableData" border stripe>
                    <!-- 展开列 -->
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                        <!--当点击New Tag按钮时展示输入Tag文本框
                        scope.row.inputVisible是在getParamsData方法中为每一组数据添加的显示切换属性，用来为文本和按钮来进行切换效果
                        scope.row.inputValue 也是在getParamsData方法中为每一组数据添加的属性，用来区分每一组数据input输入的值，代表input框输入的值。
                        -->
                        <el-input
                          class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                        ></el-input>
                        <!-- 新建Tag按钮区域 -->
                        <el-button v-else class="button-new-tag" size="small"  @click="showInput(scope.row)">+ New Tag</el-button>
                      </template>
                    </el-table-column>
                    <!-- 索引列 -->
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <!--操作区域  -->
                     <el-table-column label="操作">
                       <template slot-scope="scope">
                        <el-button
                          type="primary"
                          icon="el-icon-edit"
                          size="mini"
                          @click="showEditDialog(scope.row.attr_id)"
                        >编辑</el-button>
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          size="mini"
                          @click="removeParams(scope.row.attr_id)"
                        >删除</el-button>
                      </template>
                     </el-table-column>
                  </el-table>
                </el-tab-pane>
                 <!-- 添加静态属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                  <!-- 添加静态属性按钮 -->
                  <el-button type="primary" size="mini" :disabled="isBtnDisabled"  @click="addDialogVisible = true">添加属性</el-button>
                  <!-- 静态属性表格 -->
                  <el-table :data="onlyTableData" border stripe>
                    <!-- 展开列 -->
                    <el-table-column type="expand">
                       <template slot-scope="scope">
                        <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                        <!--当点击New Tag按钮时展示输入Tag文本框
                        scope.row.inputVisible是在getParamsData方法中为每一组数据添加的显示切换属性，用来为文本和按钮来进行切换效果
                        scope.row.inputValue 也是在getParamsData方法中为每一组数据添加的属性，用来区分每一组数据input输入的值，代表input框输入的值。
                        -->
                        <el-input
                          class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                        ></el-input>
                        <!-- 新建Tag按钮区域 -->
                        <el-button v-else class="button-new-tag" size="small"  @click="showInput(scope.row)">+ New Tag</el-button>
                      </template>
                    </el-table-column>
                    <!-- 索引列 -->
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <!--操作区域  -->
                     <el-table-column label="操作">
                       <template slot-scope="scope">
                        <el-button
                          type="primary"
                          icon="el-icon-edit"
                          size="mini"
                          @click="showEditDialog(scope.row.attr_id)"
                        >编辑</el-button>
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          size="mini"
                          @click="removeParams(scope.row.attr_id)"
                        >删除</el-button>
                      </template>
                     </el-table-column>
                  </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数对话框 动态和静态属性用统一添加窗口  getTitleText动态表单title-->
          <el-dialog :title=" '添加' + getTitleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed"
          >
            <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
              <el-form-item :label="getTitleText" prop="attr_name">
                <el-input v-model="addFrom.attr_name"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 编辑参数对话框 -->
          <el-dialog
            :title=" '修改' + getTitleText"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
          >
            <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
              <el-form-item :label="getTitleText" prop="attr_name">
                <el-input v-model="editFrom.attr_name"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
          </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 商品分类列表数组
      cateList: [],
      // 选中后的分类父级id
      selectedCateKeys: [],
      // 指定级联选择器的配置对象，用来配置需要展示的数据字段名
      cateProps: {
        // 配置触发选项,有两种 hover/click ，hover就是鼠标放上去就是触发显示
        expandTrigger: 'hover',
        value: 'cat_id', // 分类的id
        label: 'cat_name', // 分类名称
        children: 'children' // 用什么字段名来关联下级
      },
      // 被激活的Tab页签名称,默认第一个选中many选项
      activeName: 'many',
      //   动态参数数据
      manyTableData: [],
      //   静态属性数据
      onlyTableData: [],
      // 添加对话框的显示隐藏
      addDialogVisible: false,
      // 添加对话框表单数据对象
      addFrom: {
        attr_name: ''
      },
      //   添加表单的验证规则
      addFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 编辑对话框显示隐藏
      editDialogVisible: false,
      // 修改表单数据对象
      editFrom: {
        attr_name: ''
      },
      editFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据列表失败！')
      }
      this.cateList = res.data
    },
    // 级联选择框 选中变化 触发
    handleChange () {
      this.getParamsData()
    },
    // Tab页签点击事件的处理函数
    handleTabClick () {
      this.getParamsData()
    },
    // 根据所选分类的Id,和当前面板的参数，获取参数的列表数据
    async getParamsData () {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        // 清空选择器选择的key值
        this.selectedCateKeys = []
        // 清空列表表格数据
        this.manyTableData = []
        this.onlyTableData = []
        return 0
      }
      // 根据所选分类的Id,和当前面板的参数, 获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      res.data.forEach(item => {
        //   通过三元表达式判断attr_vals是否为空
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

        // 为每一行数据添加一个控制文本框的显示与隐藏，用来分区
        item.inputVisible = false
        // 为每一行数据添加一个文本框的输入值 用来分区
        item.inputValue = ''
      })
      // 如果为动态参数时。
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 添加对话框关闭事件
    addDialogClosed () {
      this.$refs.addFromRef.resetFields()
    },
    // 添加参数
    addParams () {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 修改对话框关闭事件
    editDialogClosed () {
      this.$refs.editFromRef.resetFields()
    },
    // 点击编辑按钮事件，并传入编辑的属性id值
    async showEditDialog (attrId) {
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes/${attrId}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败！')
      }
      // 将查询到的结果集双休绑定到编辑表单数据对象上，进行数据的展示
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    // 修改表单数据，提交表单
    editParams () {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.getCateId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除操作
    async removeParams (attrId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.getCateId}/attributes/${attrId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('删除参数成功！')
      this.getParamsData()
    },
    // 文本框失去焦点,或者按下Enter触发 row 代表每一列的数据对象，inputVisible，就是我们添加的自定义属性，用来切换文本和按钮的效果
    handleInputConfirm (row) {
      // 输入的内容为空时，清空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        // 当失去焦点后，将input框隐藏，显示按钮
        row.inputVisible = false
        return 0
      }
      // 如果内容不为空就后续操作
      // 1、先将添加的数据填充到每一列的数据的attr_vals数组中
      // 2、发起ajax将数据传给后台，记录到数据库中
      row.attr_vals.push(row.inputValue.trim())
      // 填充完后，记得清空数据和隐藏input
      row.inputValue = ''
      row.inputVisible = false
      // 提交数据库，保存修改
      this.saveAttrVals(row)
    },
    // 将对attr_vals（Tag） 的操作 保存到数据库
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name, // 分类名称
          attr_sel: row.attr_sel, // 添加到那个选项卡下面
          attr_vals: row.attr_vals.join(' ') // 添加的参数值进行拼接成字符串
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },
    // New Tag按钮点击事件  点击按钮显示输入框 row代表每一列的数据对象,inputVisible代表当前列新增标签input框输入的值
    showInput (row) {
      // 当点击按钮后，将input框显示，隐藏按钮
      row.inputVisible = true
      // $nextTick方法的作用是当页面上的元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        // 让文本框自动获得焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 标签上面的删除操作时间，删除对应的参数
    handleClose (i, row) {
      // splice 函数表示从数组中删除指定位置的元素，并返回被删除后的结果
      // i表示要删除的位置，也就是循环中的key值，1表示删除个数
      row.attr_vals.splice(i, 1)
      // 删除成功后，将删除后的结果传给保存修改方法，保存到数据库
      this.saveAttrVals(row)
    }
  },
  // 计算属性  也就是依赖某个值计算得来得数据,当this.selectedCateKeys.length有改变时，
  // 就会触发isBtnDisabled函数并返回对应的值，来让disabled发现改变，并进行缓存，只有当this.selectedCateKeys.length再次改变的时候，才会重新计算
  computed: {
    //   按钮需要被禁用返回true, 否则返回false
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类Id
    getCateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 添加表单的动态title文本
    getTitleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt{
    margin: 15px 0px;
}
.el-tag {
  margin: 8px;
}
.input-new-tag{
  width: 90px;
}
</style>
