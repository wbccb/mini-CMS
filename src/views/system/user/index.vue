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
        <el-button type="info" plain icon="Upload" @click="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>

      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button circle icon="Refresh" @click="forceRefresh" />
      </el-tooltip>
    </template>
    <template v-slot:base-table-content>
      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          label="用户编号"
          align="center"
          key="userId"
          prop="userId"
          v-if="columns[0].visible"
        />
        <el-table-column
          label="用户名称"
          align="center"
          key="userName"
          prop="userName"
          v-if="columns[1].visible"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="用户昵称"
          align="center"
          key="nickName"
          prop="nickName"
          v-if="columns[2].visible"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="部门"
          align="center"
          key="deptName"
          prop="dept.deptName"
          v-if="columns[3].visible"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="手机号码"
          align="center"
          key="phonenumber"
          prop="phonenumber"
          v-if="columns[4].visible"
          width="120"
        />
        <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          v-if="columns[6].visible"
          width="160"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="150"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-tooltip content="修改" placement="top" v-if="scope.row.userId !== 1">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="scope.row.userId !== 1">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="重置密码" placement="top" v-if="scope.row.userId !== 1">
              <el-button
                link
                type="primary"
                icon="Key"
                @click="handleResetPwd(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" v-if="scope.row.userId !== 1">
              <el-button
                link
                type="primary"
                icon="CircleCheck"
                @click="handleAuthRole(scope.row)"
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
      <CreateUser v-model="openDialog" @close-dialog="openDialog = false"></CreateUser>
    </template>
  </TableBaseView>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import TableBaseView from "@/components/table/TableBaseView.vue";
import PaginationBar from "@/components/table/PaginationBar.vue";
import CreateUser from "@/views/system/user/CreateUser.vue";
import AuthRole from "@/views/system/user/AuthRole.vue";
import {networkGetUserList} from "@/api/user";
import {ResponseData} from "@/utils/networkUtil";
import {NetworkRoleUser, QueryUserListParams} from "@/api/role";
import {usePaginationBar} from "@/common/hooks/usePaginationBar";
import {parseTime} from "@/utils/ruoyi_test";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "userIndex",
  components: {AuthRole, CreateUser, PaginationBar},
  props: {},
  setup(props, context) {
    // ----------分页逻辑-----------
    const getList = () => {
      return async (pageNo: number, pageSize: number) => {
        const query: QueryUserListParams = {
          pageNum: pageNo,
          pageSize: pageSize,
        };
        const data: ResponseData<NetworkRoleUser[]> = await networkGetUserList(query);
        return data;
      };
    };
    const {dataList, forceRefresh, indexMethod, ...returnObject} =
      usePaginationBar<NetworkRoleUser>(getList());

    onMounted(() => {
      forceRefresh();
    });

    const openDialog = ref(false);
    // ---------- table上面的按钮集合 -----------
    const single = ref(false);
    const multiple = ref(false);
    const handleAdd = () => {
      openDialog.value = true;
    };
    const handleUpdate = (item: NetworkRoleUser) => {};
    const handleDelete = (item: NetworkRoleUser) => {};
    const handleImport = () => {};
    const handleExport = () => {};
    const handleResetPwd = (item: NetworkRoleUser) => {};
    const router = useRouter();
    const handleAuthRole = (item: NetworkRoleUser) => {
      // 跳转到用户授权角色的路由
      const userId = item.userId;
      router.push(`/system/user-auth/role/${userId}`);
    };

    // ----------- table的处理方法集合--------------
    const handleSelectionChange = () => {};
    const handleStatusChange = (item: NetworkRoleUser) => {};

    const columns = ref([
      {key: 0, label: `用户编号`, visible: true},
      {key: 1, label: `用户名称`, visible: true},
      {key: 2, label: `用户昵称`, visible: true},
      {key: 3, label: `部门`, visible: true},
      {key: 4, label: `手机号码`, visible: true},
      {key: 5, label: `状态`, visible: true},
      {key: 6, label: `创建时间`, visible: true},
    ]);

    return {
      openDialog,
      handleResetPwd,
      handleAuthRole,
      handleSelectionChange,
      handleStatusChange,
      parseTime,
      single,
      multiple,
      handleAdd,
      handleUpdate,
      handleDelete,
      handleImport,
      handleExport,
      dataList,
      forceRefresh,
      indexMethod,
      ...returnObject,
      columns,
    };
  },
});
</script>

<style scoped lang="scss"></style>
