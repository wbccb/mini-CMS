<template>
  <div class="menu-wrapper">
    <!--表格上面的按钮功能，比如新增、刷新、展开/折叠等等-->
    <div class="tool-wrapper">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
        </el-col>

        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button circle icon="Refresh" @click="forceRefresh" />
        </el-tooltip>
      </el-row>
    </div>

    <div class="table-wrapper" ref="elTableParent">
      <el-table
        v-if="initFinish"
        v-loading="loading"
        :data="menuList"
        :max-height="elTableHeight"
        row-key="menuId"
        :default-expand-all="isExpandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column
          fixed
          prop="menuName"
          label="菜单名称"
          :show-overflow-tooltip="true"
          width="160"
        ></el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template #default="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
        <el-table-column
          prop="perms"
          label="权限标识"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="component"
          label="组件路径"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :disable-transitions="true" type="info">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="160" prop="createTime">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="210"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">
              修改
            </el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <CreateMenu
      v-model="openDialog"
      :menuList="menuList"
      @close-dialog="openDialog = false"
    ></CreateMenu>
  </div>
</template>

<script lang="ts">
import {defineComponent, nextTick, onMounted, ref} from "vue";
import {handleTree, parseTime} from "@/utils/ruoyi_test";
import {usePaginationBar} from "@/common/hooks/usePaginationBar";
import {networkGetMenuList, NetworkMenu} from "@/api/menu";
import {ResponseData} from "@/utils/networkUtil";
import CreateMenu from "@/views/system/menu/CreateMenu.vue";

export default defineComponent({
  name: "MenuIndex",
  components: {CreateMenu},
  props: {},
  setup() {
    const openDialog = ref(false);
    const handleAdd = () => {
      // 弹出提示框
      openDialog.value = true;
    };

    const isExpandAll = ref(false);
    const toggleExpandAll = async () => {
      isExpandAll.value = !isExpandAll.value;
      initFinish.value = false;
      await nextTick();
      initFinish.value = true;
    };

    const handleUpdate = (item: any) => {};
    const handleDelete = (item: any) => {};

    const menuArray = ref<NetworkMenu[]>([]);

    // 实际请求的业务方法
    const getList = () => {
      return async (pageNo: number, pageSize: number) => {
        const data: ResponseData<NetworkMenu[]> = await networkGetMenuList();
        menuArray.value = data.data;
        const treeData = handleTree(data.data, "menuId");
        data.data = treeData;
        console.info(treeData);
        return data;
      };
    };

    // 分页逻辑结合
    const {dataList, forceRefresh, indexMethod, ...returnObject} = usePaginationBar<NetworkMenu>(
      getList()
    );

    const initFinish = ref(false);
    onMounted(() => {
      forceRefresh();

      if (elTableParent.value) {
        const height = elTableParent.value.clientHeight;
        elTableHeight.value = height;

        initFinish.value = true;
      }
    });

    const elTableParent = ref<typeof HTMLDivElement>();
    const elTableHeight = ref(200);

    return {
      initFinish,
      handleAdd,
      toggleExpandAll,
      getList,
      parseTime,
      handleUpdate,
      handleDelete,
      isExpandAll,
      menuList: dataList,
      forceRefresh,
      indexMethod,
      elTableParent,
      elTableHeight,
      ...returnObject,
      openDialog,
      menuArray,
    };
  },
});
</script>

<style scoped lang="scss">
.menu-wrapper {
  display: flex;
  flex-direction: column;

  height: 100%;

  .tool-wrapper {
  }

  .table-wrapper {
    height: 100%;
  }
}
</style>
