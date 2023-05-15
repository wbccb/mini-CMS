<template>
  <el-dialog :title="title" v-model="dialogOpen" width="500px" append-to-body>
    <el-form ref="roleRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item prop="roleKey">
        <template #label>
          <span>
            <el-tooltip
              content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
              placement="top"
            >
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
            权限字符
          </span>
        </template>
        <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
      </el-form-item>
      <el-form-item label="角色顺序" prop="roleSort">
        <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">
          展开/折叠
        </el-checkbox>
        <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">
          全选/全不选
        </el-checkbox>
        <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event)">
          父子联动
        </el-checkbox>
        <el-tree
          class="tree-border"
          :data="menuOptions"
          show-checkbox
          ref="menuRef"
          node-key="id"
          :check-strictly="!form.menuCheckStrictly"
          empty-text="加载中，请稍候"
          :props="{label: 'label', children: 'children'}"
        ></el-tree>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
import {defineComponent, PropType, reactive, ref, computed, onMounted} from "vue";
import {NetworkMenu} from "@/api/menu";
import sysShowHideData from "@/common/mock/system/dict/type/sys_show_hide.json";
import sysNormalDisable from "@/common/mock/system/dict/type/sys_normal_disable.json";
import IconSelect from "@/components/icon-select/IconSelect.vue";
import {NetworkCreateRoleTree, networkGetCreateRoleMenuList, networkGetRoleList} from "@/api/role";

interface CreateRoleForm {
  roleName: string;
  roleKey: string;
  roleSort: number;
  status: string;
  menuCheckStrictly: boolean;
  remark: string;
}

export default defineComponent({
  name: "CreateRole",
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
    const form = reactive<CreateRoleForm>({
      roleName: "",
      roleKey: "",
      roleSort: 0,
      status: "",
      menuCheckStrictly: false,
      remark: "",
    });

    const rules = {
      roleName: [{required: true, message: "角色名称不能为空", trigger: "blur"}],
      roleKey: [{required: true, message: "权限字符不能为空", trigger: "blur"}],
      roleSort: [{required: true, message: "角色顺序不能为空", trigger: "blur"}],
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

    const menuRef = ref();
    const menuExpand = ref(false);
    const menuNodeAll = ref(false);
    const handleCheckedTreeExpand = (value: boolean) => {
      const treeList = menuOptions.value;
      for (let i = 0; i < treeList.length; i++) {
        const tree = treeList[i];
        const id = tree.id;
        menuRef.value.store.nodesMap[id].expanded = value;
      }
    };
    const handleCheckedTreeNodeAll = (value: boolean) => {
      menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
    };
    const handleCheckedTreeConnect = (value: boolean) => {
      form.menuCheckStrictly = value ? true : false;
    };

    const submit = () => {};
    const cancel = () => {
      dialogOpen.value = false;
    };

    const sys_show_hide = sysShowHideData;
    const sys_normal_disable = sysNormalDisable;

    const menuOptions = ref<NetworkCreateRoleTree[]>([]);
    onMounted(() => {
      networkGetCreateRoleMenuList().then((res: NetworkCreateRoleTree[]) => {
        menuOptions.value = res;
        console.warn("createRole拿到的菜单是", res);
      });
    });

    return {
      title,
      rules,
      form,
      dialogOpen,
      menuRef,
      menuExpand,
      menuNodeAll,
      handleCheckedTreeExpand,
      handleCheckedTreeNodeAll,
      handleCheckedTreeConnect,
      submit,
      cancel,
      sys_show_hide,
      sys_normal_disable,
      menuOptions,
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