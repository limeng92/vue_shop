<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- layout 布局 row 代表一行，col 代表一列
                span   属性就是占据多大的位置，一个row总共有24个占位
                gutter 是element中layout布局中属性，用来控制每一个col的之间间距
            -->
            <el-row :gutter="20">
                <!-- 搜索 添加 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加按钮区域 -->
               <el-col :span="4">
                   <el-button type="primary">添加</el-button>
                </el-col>
            </el-row>

        </el-card>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="less" scoped>

</style>
