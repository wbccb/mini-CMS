<template>
  <TableBaseView>
    <template v-slot:base-table-header>
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
    </template>
    <template v-slot:base-table-content>
      <el-table v-loading="loading" :data="dataList">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色编号" prop="roleId" width="120" />
        <el-table-column
          label="角色名称"
          prop="roleName"
          :show-overflow-tooltip="true"
          width="150"
        />
        <el-table-column
          label="权限字符"
          prop="roleKey"
          :show-overflow-tooltip="true"
          width="150"
        />
        <el-table-column label="显示顺序" prop="roleSort" width="100" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="created_at">
          <template #default="scope">
            <span>{{ parseTime(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top" v-if="scope.row.roleId !== 1">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="scope.row.roleId !== 1">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>
<!--            <el-tooltip content="数据权限" placement="top" v-if="scope.row.roleId !== 1">-->
<!--              <el-button-->
<!--                link-->
<!--                type="primary"-->
<!--                icon="CircleCheck"-->
<!--                @click="handleDataScope(scope.row)"-->
<!--              ></el-button>-->
<!--            </el-tooltip>-->
            <el-tooltip content="分配用户" placement="top" v-if="scope.row.roleId !== 1">
              <el-button
                link
                type="primary"
                icon="User"
                @click="handleAuthUser(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-slot:base-table-footer>
      <PaginationBar
        class="main-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
      ></PaginationBar>
    </template>

    <template v-slot:other>
      <CreateRole v-model="openDialog" @close-dialog="openDialog = false"></CreateRole>
    </template>
  </TableBaseView>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import TableBaseView from "@/components/table/TableBaseView.vue";
import {usePaginationBar} from "@/common/hooks/usePaginationBar";
import {networkGetRoleList, NetworkRole} from "@/common/api/system/role";
import {ResponseData} from "@/common/utils/networkUtil";
import {handleTree} from "@/common/utils/ruoyi_test";
import {parseTime} from "@/common/utils/ruoyi_test";
import PaginationBar from "@/components/table/PaginationBar.vue";
import CreateRole from "@/views/system/role/CreateRole.vue";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "RoleIndex",
  components: {CreateRole, PaginationBar, TableBaseView},
  props: {},
  setup() {
    const openDialog = ref(false);
    // ----------table上面的工具按钮-----------
    const handleAdd = () => {
      openDialog.value = true;
    };
    const handleUpdate = (item: NetworkRole) => {};
    const handleDelete = (item: NetworkRole) => {};
    const handleExport = () => {};
    const single = ref(false);
    const multiple = ref(false);
    // ----------table上面的工具按钮-----------

    // ----------分页逻辑-----------
    const getList = () => {
      return async (pageNo: number, pageSize: number) => {
        const data: ResponseData<NetworkRole[]> = await networkGetRoleList();
        return data;
      };
    };
    const {dataList, forceRefresh, indexMethod, ...returnObject} = usePaginationBar<NetworkRole>(
      getList()
    );

    onMounted(() => {
      forceRefresh();
    });

    const handleStatusChange = (item: NetworkRole) => {};

    const roleId = ref("");
    const openRolePermissionDialog = ref(false);
    const handleDataScope = (item: NetworkRole) => {
      roleId.value = item.roleId;
      openRolePermissionDialog.value = true;
    };
    const router = useRouter();
    const handleAuthUser = (item: NetworkRole) => {
      router.push(`/system/role-auth/user/${item.roleId}`);
    }
    // ----------分页逻辑-----------

    return {
      openRolePermissionDialog,
      roleId,
      openDialog,
      handleStatusChange,
      handleDataScope,
      handleAuthUser,
      parseTime,
      single,
      multiple,
      handleAdd,
      handleUpdate,
      handleDelete,
      handleExport,
      dataList,
      forceRefresh,
      indexMethod,
      ...returnObject,
    };
  },
});
</script>

<style scoped lang="scss"></style>
