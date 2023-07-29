<template>
  <TableBaseView>
    <template v-slot:base-table-header>
      <h4 class="form-header h4">基本信息</h4>
      <el-form :model="form" label-width="80px">
        <el-row>
          <el-col :span="8" :offset="2">
            <el-form-item label="用户昵称" prop="nickName" key="nickName">
              <el-input v-model="form.nickName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="登录账号" prop="userName" key="userName">
              <el-input v-model="form.userName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template v-slot:base-table-content>
      <h4 class="form-header h4">角色信息</h4>
      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" row-key="index">
        <el-table-column label="序号" width="55" type="index" align="center" key="index">
          <template #default="scope">
            <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column label="角色编号" align="center" prop="roleId" key="roleId" />
        <el-table-column label="角色名称" align="center" prop="roleName" key="roleName"/>
        <el-table-column label="权限字符" align="center" prop="roleKey" key="roleName"/>
        <el-table-column label="创建时间" align="center" prop="createTime" key="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
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
    
    <template v-slot:base-table-footer-btn>
      <el-form label-width="100px">
        <div style="text-align: center; margin-left: -120px; margin-top: 30px">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="close">返回</el-button>
        </div>
      </el-form>
    </template>

    <template v-slot:other></template>
  </TableBaseView>
</template>

<script lang="ts">
import {defineComponent, nextTick, onMounted, reactive, ref, watchEffect} from "vue";
import TableBaseView from "@/components/table/TableBaseView.vue";
import CreateUser from "@/views/system/user/CreateUser.vue";
import PaginationBar from "@/components/table/PaginationBar.vue";
import {NetworkRole, NetworkUser, QueryUserListParams} from "@/common/api/system/role";
import {ResponseData} from "@/common/utils/networkUtil";
import {networkGetRoleListInAddUser, networkGetUserList, NetworkUserAndRoles} from "@/common/api/user";
import {usePaginationBar} from "@/common/hooks/usePaginationBar";
import {parseTime} from "@/common/utils/ruoyi_test";
import {useRoute, useRouter} from "vue-router";

interface UserFrom {
  nickName: string;
  userName: string;
}

export default defineComponent({
  name: "AuthRole",
  props: {},
  components: {PaginationBar, CreateUser, TableBaseView},
  setup() {
    const form = reactive<UserFrom>({
      nickName: "",
      userName: "",
    });

    // ----------分页逻辑-----------
    const getList = () => {
      return async (pageNo: number, pageSize: number) => {
        const startIndex = (pageNo-1) * pageSize;
        const data = roleList.value.slice(startIndex, startIndex + pageSize);
        return {
          data: data
        }
      };
    };
    const {total, dataList, forceRefresh, indexMethod, ...returnObject} =
      usePaginationBar<NetworkRole>(getList());
    
    onMounted(() => {
      forceRefresh();
    });

    // 先获取所有数据roleList，然后在getList()中进行当前页的数据获取
    const roleList = ref<NetworkRole[]>([]);
    const route = useRoute();
    onMounted(async () => {
      const userId = route.params.userId as string;
      if (userId) {
        // TODO 暂时使用ruoyi后台接口，破坏数据结构，这个接口ruoyi没有做分页，它采取是获取所有列表数据，然后手动分页的逻辑
        const response: NetworkUserAndRoles = await networkGetRoleListInAddUser(userId);
        form.nickName = response.user.nickName;
        form.userName = response.user.userName;

        roleList.value = response.roles;
        total.value = response.roles.length;
        // TODO 处理已经勾选的逻辑，即当前用户已经选中
        
        await nextTick();
        forceRefresh();
      }
    });

    const handleSelectionChange = () => {};

    const submit = () => {};
    const router = useRouter();
    const close = () => {
      const obj = {path: "/system/user"};
      router.push(obj);
    };

    return {
      parseTime,
      dataList,
      forceRefresh,
      indexMethod,
      total,
      ...returnObject,
      form,
      submit,
      close,
      handleSelectionChange,
    };
  },
});
</script>

<style scoped lang="scss">
.authRole_wrapper {
}
</style>