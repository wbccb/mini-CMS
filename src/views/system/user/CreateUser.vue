<template>
  <el-dialog :title="title" v-model="dialogOpen" width="600px" append-to-body>
    <el-form :model="form" :rules="rules" label-width="100px" ref="elForm">

      <el-row>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
      </el-row>

      <el-row>

        <el-col :span="12">
          <el-form-item label="用户密码" prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入用户密码"
              type="password"
              maxlength="20"
              show-password
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>

        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="角色">
            <el-select v-model="form.roleId" placeholder="请选择">
              <el-option
                v-for="item in dataList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

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
import {NetworkMenu} from "@/common/api/system/menu";
import sysShowHideData from "@/common/mock/system/dict/type/sys_show_hide.json";
import sysNormalDisable from "@/common/mock/system/dict/type/sys_normal_disable.json";
import sysUserSex from "@/common/mock/system/dict/type/sys_user_sex.json";
import IconSelect from "@/components/icon-select/icon-select.vue";
import {
  networkCreateOrUpdateRole,
  networkGetCreateRoleMenuList,
  networkGetRoleList,
  ResponseRole,
} from "@/common/api/system/role";
import MenuTreeCheckBox from "@/components/menu-tree-checkbox/menu-tree-checkbox.vue";
import {ResponseListData} from "@/common/utils/networkUtil";
import {networkCreateOrUpdateUser, networkGetRoleListInAddUser} from "@/common/api/system/people";
import {usePaginationBar} from "@/common/hooks/usePaginationBar";
import useUserStore, {ResponseUser} from "@/store/modules/user";
import {ElMessage, FormInstance} from "element-plus";
import {useSubmitForm} from "@/common/hooks/useSubmitForm";
import {RoleType} from "@/common/utils/CONST";

export type CreateUserForm = {
  password: string;
  roleIds: string[];
} & Omit<ResponseUser, "userId"|"id">;

export default defineComponent({
  name: "CreateUser",
  components: {MenuTreeCheckBox, IconSelect},
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
    const form = reactive<RequestUser>({
      name: "",
      email: "",
      password: "",
      roleId: RoleType.普通用户,
      status: true,
      permissions: "",
      userId: "",
    });

    const rules = {
      userName: [
        {required: true, message: "用户名称不能为空", trigger: "blur"},
        {
          min: 2,
          max: 20,
          message: "用户名称长度必须介于 2 和 20 之间",
          trigger: "blur",
        },
      ],
      password: [
        {required: true, message: "用户密码不能为空", trigger: "blur"},
        {
          min: 5,
          max: 20,
          message: "用户密码长度必须介于 5 和 20 之间",
          trigger: "blur",
        },
      ],
      email: [{type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"]}],
      phonenumber: [
        {pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur"},
      ],
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


    const elForm = ref<FormInstance>();
    const {checkRulesAndSubmit} = useSubmitForm(elForm);
    const isUpdate = ref(false);

    const submit = () => {
      checkRulesAndSubmit(async () => {
        const addRes = await networkCreateOrUpdateUser(form, isUpdate.value);
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
    const sys_user_sex = sysUserSex;

    return {
      elForm,
      title,
      rules,
      form,
      dialogOpen,
      submit,
      cancel,
      sys_show_hide,
      sys_normal_disable,
      sys_user_sex,
      dataList,
      forceRefresh,
      indexMethod,
      ...returnObject,
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
