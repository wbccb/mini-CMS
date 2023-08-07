<template>
  <el-dialog title="选择用户" v-model="dialogOpen" width="800px" top="5vh" append-to-body>
    <TableBaseView>
      <template v-slot:base-table-content="slotProps">
        <el-table
          @row-click="clickRow"
          ref="refTable"
          :data="dataList"
          @selection-change="handleSelectionChange"
          height="260px"
        >
          <el-table-column type="selection" width="55"></el-table-column>
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
        </el-table>
      </template>
    </TableBaseView>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import TableBaseView from "@/components/table/TableBaseView.vue";
import PaginationBar from "@/components/table/PaginationBar.vue";
import {parseTime} from "@/common/utils/ruoyi_test";
import sysNormalDisable from "@/common/mock/system/dict/type/sys_normal_disable.json";
import {networkGetUnallocatedUserList, QueryUserListParams} from "@/common/api/system/role";
import {ResponseListData} from "@/common/utils/networkUtil";
import {usePaginationBar} from "@/common/hooks/usePaginationBar";
import {useRoute} from "vue-router";

export default defineComponent({
  name: "SelectUser",
  components: {PaginationBar, TableBaseView},
  props: {
    modelValue: {
      type: Boolean,
    },
  },
  emits: ["close-dialog", "update:modelValue"],
  setup(props, context) {
    const sys_normal_disable = sysNormalDisable;

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
        const data: ResponseListData<NetworkUser[]> = await networkGetUnallocatedUserList(query);
        return data;
      };
    };

    // 分页逻辑结合
    const {dataList, forceRefresh, indexMethod, pageSize, currentPage, ...returnObject} =
      usePaginationBar<NetworkUser>(getList());

    const initFinish = ref(true);
    onMounted(() => {
      forceRefresh();
    });

    // 操作按钮相关的逻辑
    const title = ref(""); // 根据操作进行变化
    const dialogOpen = computed({
      get: () => {
        return props.modelValue;
      },
      set: (value: any) => {
        context.emit("update:modelValue", value);
      },
    });

    const clickRow = (item: NetworkUser) => {};
    const userIds = ref<Array<number>>([]);
    const handleSelectionChange = (selection: Array<NetworkUser>) => {
      userIds.value = selection.map((item) => item.userId);
    };
    const submit = () => {
      const roleId = route.query["roleId"];
      const uIds = userIds.value.join(",");
      // TODO 进行网络批量授权功能
    };
    const cancel = () => {
      dialogOpen.value = false;
    };

    return {
      title,
      dialogOpen,
      clickRow,
      handleSelectionChange,
      submit,
      cancel,
      parseTime,
      sys_normal_disable,
      dataList,
      forceRefresh,
      indexMethod,
      pageSize,
      currentPage,
      ...returnObject,
    };
  },
});
</script>

<style scoped lang="scss"></style>
