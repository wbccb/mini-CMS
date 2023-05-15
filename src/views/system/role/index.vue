<template>
  <div class="role-wrapper">
    <!--顶部的工具按钮-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>

      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button circle icon="Refresh" @click="forceRefresh" />
      </el-tooltip>
    </el-row>
    <!--列表数据-->
    <el-table></el-table>
  </div>
</template>

<script setup lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "RoleIndex",
  props: {},
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss"></style>
