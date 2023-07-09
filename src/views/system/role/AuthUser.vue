<template>
  <TableBaseView>
    <template v-slot:base-table-header>
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">添加用户</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="CircleClose"
            :disabled="multiple"
            @click="cancelAuthUserAll"
          >
            批量取消授权
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="Close" @click="handleClose">关闭</el-button>
        </el-col>

        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button circle icon="Refresh" @click="forceRefresh" />
        </el-tooltip>
    </template>

    <template v-slot:base-table-content="slotProps">
      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
        <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="CircleClose" @click="cancelAuthUser(scope.row)">
              取消授权
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template v-slot:base-table-footer>
      <PaginationBar
        v-show="total > 0"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></PaginationBar>
    </template>

    <template v-slot:other>
      <SelectUser
        v-model="openDialog"
        :roleId="roleId"
        @close-dialog="openDialog = false"
      ></SelectUser>
    </template>
  
  </TableBaseView>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import TableBaseView from "@/components/table/TableBaseView.vue";
import CreateMenu from "@/views/system/menu/CreateMenu.vue";
import PaginationBar from "@/components/table/PaginationBar.vue";
import {ResponseData} from "@/common/utils/networkUtil";
import {networkGetMenuList, NetworkMenu} from "@/common/api/system/menu";
import {handleTree} from "@/common/utils/ruoyi_test";
import {usePaginationBar} from "@/common/hooks/usePaginationBar";
import {parseTime} from "@/common/utils/ruoyi_test";
import {NetworkRoleUser, networkGetUserListByRoleId, QueryUserListParams} from "@/common/api/system/role";
import {useRoute, useRouter} from "vue-router";
import SelectUser from "@/views/system/role/SelectUser.vue";
import CreateRole from "@/views/system/role/CreateRole.vue";
import sysNormalDisable from "@/common/mock/system/dict/type/sys_normal_disable.json";

export default defineComponent({
  name: "AuthUser",
  components: {CreateRole, SelectUser, PaginationBar, CreateMenu, TableBaseView},
  setup() {
    const router = useRouter();
    const openDialog = ref(false);
    // ----------table上面的工具按钮-----------
    const handleAdd = () => {
      openDialog.value = true;
    };
    // 批量取消授权
    const multiple = ref(false);
    const cancelAuthUserAll = () => {};
    // 关闭当前窗口，回到上一个窗口路由
    const handleClose = () => {
      // TODO 要结合TagsView进行编程
      router.push({path: "/system/role"});
    };
    const sys_normal_disable = sysNormalDisable;

    // 取消该用户的授权
    const cancelAuthUser = (user: NetworkRoleUser) => {};

    const route = useRoute();

    // 实际请求的业务方法
    const getList = () => {
      return async (pageNo: number, pageSize: number) => {
        const roleId = route.params["roleId"] as string;
        const query: QueryUserListParams = {
          pageNum: pageNo,
          pageSize: pageSize,
          roleId: roleId,
        };
        const data: ResponseData<NetworkRoleUser[]> = await networkGetUserListByRoleId(query);
        return data;
      };
    };

    // 分页逻辑结合
    const {dataList, forceRefresh, indexMethod, pageSize, currentPage, ...returnObject} =
      usePaginationBar<NetworkRoleUser>(getList());

    const initFinish = ref(true);
    onMounted(() => {
      forceRefresh();
    });

    const roleId = route.params.roleId;
    // const queryParams = reactive({
    //   pageNum: currentPage,
    //   pageSize: pageSize,
    //   roleId: route.params.roleId,
    //   userName: undefined,
    //   phonenumber: undefined,
    // });
    
    const handleSelectionChange = ()=> {
    
    }

    return {
      openDialog,
      handleAdd,
      handleClose,
      sys_normal_disable,
      cancelAuthUser,
      parseTime,
      initFinish,
      dataList,
      forceRefresh,
      indexMethod,
      pageSize,
      currentPage,
      roleId,
      ...returnObject,
      multiple,
      cancelAuthUserAll,
      handleSelectionChange
    };
  },
});
</script>
<style scoped lang="scss"></style>
