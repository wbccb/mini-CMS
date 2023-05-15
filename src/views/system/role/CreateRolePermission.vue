<template>
  <!--弹出框：新增/修改-->
  <el-dialog :title="title" v-model="dialogOpen" width="500px" append-to-body>
    <el-form :model="form" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="form.roleName" :disabled="true" />
      </el-form-item>
      <el-form-item label="权限字符">
        <el-input v-model="form.roleKey" :disabled="true" />
      </el-form-item>
      <el-form-item label="权限范围">
        <el-select v-model="form.dataScope" @change="handleDataScopeChange">
          <el-option
            v-for="item in dataScopeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据权限" v-show="form.dataScope == 2">
        <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
        <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
        <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
        <el-tree
          class="tree-border"
          :data="deptOptions"
          show-checkbox
          default-expand-all
          ref="deptRef"
          node-key="id"
          :check-strictly="!form.deptCheckStrictly"
          empty-text="加载中，请稍候"
          :props="{ label: 'label', children: 'children' }"
        ></el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, ref, computed} from "vue";
import {NetworkMenu} from "@/api/menu";
import sysShowHideData from "@/common/mock/system/dict/type/sys_show_hide.json";
import sysNormalDisable from "@/common/mock/system/dict/type/sys_normal_disable.json";
import IconSelect from "@/components/icon-select/IconSelect.vue";

interface RoleDialogForm {
  roleName: string;
  roleKey: string;
  roleSort: number;
  status: string;
  remark: string;
  dataScope: string;
  deptCheckStrictly: boolean;
}

export default defineComponent({
  name: "CreateRolePermission",
  components: {IconSelect},
  props: {
    menuList: {
      type: Array as PropType<NetworkMenu[]>,
    },
    modelValue: {
      type: Boolean,
    },
  },
  emits: ["close-dialog", "update:modelValue"],
  setup(props, context) {
    const form = reactive<RoleDialogForm>({
      roleName: "",
      roleKey: "",
      roleSort: 0,
      status: "",
      remark: "",
      dataScope: "",
      deptCheckStrictly: false
    });

    const dataScopeOptions = ref([
      { value: "1", label: "全部数据权限" },
      { value: "2", label: "自定数据权限" },
      { value: "3", label: "本部门数据权限" },
      { value: "4", label: "本部门及以下数据权限" },
      { value: "5", label: "仅本人数据权限" }
    ]);

    // 根据角色ID查询所有的部门结构树
    const deptExpand = ref("");
    const deptNodeAll = ref("");
    const deptOptions = ref([]);
    const handleCheckedTreeExpand = ()=> {};
    const handleCheckedTreeNodeAll = ()=> {};
    const handleCheckedTreeConnect = ()=> {};
    const handleDataScopeChange = ()=> {
      // form.dataScope发生了改变，如果改变为自定义数据
      // 需要发送网络请求获取数据

    };


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

    const submit = ()=> {};
    const cancel = ()=> {
      dialogOpen.value = false;
    };

    return {
      deptExpand,
      deptNodeAll,
      deptOptions,
      handleDataScopeChange,
      handleCheckedTreeExpand,
      handleCheckedTreeNodeAll,
      handleCheckedTreeConnect,
      submit,
      cancel,
      title,
      form,
      dialogOpen,
      dataScopeOptions
    };
  },
});
</script>
<style scoped lang="scss">
.choose_icon_input {
  width: 16px;
  height: 32px;
}
</style>
