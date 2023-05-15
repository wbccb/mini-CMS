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
      <el-table>
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
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
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
                v-hasPermi="['system:role:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="scope.row.roleId !== 1">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:role:remove']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="数据权限" placement="top" v-if="scope.row.roleId !== 1">
              <el-button
                link
                type="primary"
                icon="CircleCheck"
                @click="handleDataScope(scope.row)"
                v-hasPermi="['system:role:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配用户" placement="top" v-if="scope.row.roleId !== 1">
              <el-button
                link
                type="primary"
                icon="User"
                @click="handleAuthUser(scope.row)"
                v-hasPermi="['system:role:edit']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-slot:base-table-footer></template>

    <template v-slot:other></template>
  </TableBaseView>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import TableBaseView from "@/components/table/TableBaseView.vue";
import {usePaginationBar} from "@/common/hooks/usePaginationBar";
import {networkGetRoleList, NetworkRole} from "@/api/role";
import {ResponseData} from "@/utils/networkUtil";
import {handleTree} from "@/utils/ruoyi_test";
import {parseTime} from "@/utils/ruoyi_test";

export default defineComponent({
  name: "RoleIndex",
  components: {TableBaseView},
  props: {},
  setup() {
    // ----------table上面的工具按钮-----------
    const handleAdd = () => {};
    const handleUpdate = (item: NetworkRole)=> {};
    const handleDelete = (item: NetworkRole)=> {};
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
    
    const handleStatusChange = (item: NetworkRole)=> {};
    const handleDataScope = (item: NetworkRole)=> {};
    const handleAuthUser = (item: NetworkRole)=> {};
    // ----------分页逻辑-----------
    
    

    return {
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
