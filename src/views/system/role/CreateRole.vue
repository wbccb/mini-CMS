<template>
  <el-dialog :title="title" v-model="dialogOpen" width="500px" append-to-body>
    <el-form ref="dialogRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
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
        <el-input v-model="formData.roleKey" placeholder="请输入权限字符" />
      </el-form-item>
      <el-form-item label="角色顺序" prop="roleSort">
        <el-input-number v-model="formData.roleSort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="角色种类" prop="roleSort">
        <el-select v-model="formData.roleType" placeholder="请选择">
          <el-option
              v-for="(value, key) in dataList"
              :key="key"
              :label="value.roleName"
              :value="value.roleId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      
      <menu-tree-check-box></menu-tree-check-box>

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
import {defineComponent, PropType, reactive, ref, computed, onMounted, watch} from "vue";
import {networkCreateOrUpdateMenu, NetworkMenu} from "@/common/api/system/menu";
import sysShowHideData from "@/common/mock/system/dict/type/sys_show_hide.json";
import sysNormalDisable from "@/common/mock/system/dict/type/sys_normal_disable.json";
import IconSelect from "@/components/icon-select/icon-select.vue";
import {
  networkCreateOrUpdateRole, ResponseRole,
  RoleDialogForm
} from "@/common/api/system/role";
import MenuTreeCheckBox from "@/components/menu-tree-checkbox/menu-tree-checkbox.vue";
import {ElMessage, FormInstance} from "element-plus";
import {useSubmitForm} from "@/common/hooks/useSubmitForm";
import {RoleType} from "@/common/utils/CONST";
import useUserStore from "@/store/modules/user";
import {ResponseListData} from "@/common/utils/networkUtil";
import {networkGetRoleListInAddUser} from "@/common/api/system/people";
import {usePaginationBar} from "@/common/hooks/usePaginationBar";



export default defineComponent({
  name: "CreateRole",
  components: {MenuTreeCheckBox, IconSelect},
  props: {
    modelValue: {
      type: Boolean,
    },
    updateItem: {
      type: Object as PropType<ResponseRole>,
      require: false
    }
  },
  emits: ["close-dialog", "update:modelValue"],
  setup(props, context) {
    const formData = reactive<RoleDialogForm>({
      roleName: "",
      roleKey: "",
      roleSort: 0,
      status: "",
      roleType: RoleType["普通用户"]
    });

    const isUpdate = ref(false);
    watch(() => props.updateItem, (value) => {
      if (value) {
        isUpdate.value = !!props.updateItem;
        const keys = Object.keys(value);
        for (const key of keys) {
          formData[key] = value[key];
        }
      }
    }, {
      immediate: true
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


    const dialogRef = ref<FormInstance>();

    const {checkRulesAndSubmit} = useSubmitForm(dialogRef);
    const submit = () => {
      // TODO 创建角色
      checkRulesAndSubmit(async () => {
        const addRes = await networkCreateOrUpdateRole(formData, isUpdate.value);
        let msg = "新增成功";
        if (isUpdate.value) {
          msg = "更新成功";
        }
        ElMessage({message: msg, type: "success", duration: 20 * 1000});
        cancel();
      });
    };
    const cancel = () => {
      dialogOpen.value = false;
    };

    const sys_show_hide = sysShowHideData;
    const sys_normal_disable = sysNormalDisable;

    // TODO 根据目前登录用户获取对应的角色列表数据
    // ----------分页逻辑-----------
    const userStore = useUserStore();
    const getList = () => {
      return async (pageNo: number, pageSize: number) => {
        const userId = userStore.user.id;
        const data: ResponseListData<ResponseRole[]> = await networkGetRoleListInAddUser(userId);
        return data;
      };
    };
    const {dataList, forceRefresh, indexMethod, ...returnObject} = usePaginationBar<ResponseRole>(
        getList()
    );

    onMounted(() => {
      forceRefresh();
    });
    // ----------分页逻辑-----------



    return {
      title,
      rules,
      formData,
      dialogOpen,
      submit,
      cancel,
      sys_show_hide,
      sys_normal_disable,
      dialogRef,
      RoleType,
      dataList
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