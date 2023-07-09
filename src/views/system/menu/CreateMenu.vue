<template>
  <!--弹出框：新增/修改-->
  <el-dialog :title="dialogTitle" v-model="dialogOpen" width="680px" append-to-body>
    <el-form ref="dialogRef" :model="formData" :rules="formRules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单">
            <el-tree-select
                v-model="formData.parentId"
                :data="menuOptions"
                :props="{value: 'menuId', label: 'menuName', children: 'children'}"
                value-key="menuId"
                placeholder="选择上级菜单"
                check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="formData.menuType">
              <el-radio label="M">目录</el-radio>
              <el-radio label="C">菜单</el-radio>
              <el-radio label="F">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <!--          选择已经有的菜单图标-->
        <el-col :span="24">
          <el-form-item label="菜单图标" props="icon">
            <!--整个内容包裹在弹出泡泡中-->
            <el-popover
                placement="bottom-start"
                :width="540"
                v-model:visible="showChooseIcon"
                trigger="click"
                @show="showSelectIcon"
            >
              <!--初始化展示的内容-->
              <template #reference>
                <!--图标的文字-->
                <el-input
                    v-model="formData.icon"
                    placeholder="点击选择图标"
                    @blur="showSelectIcon"
                    readonly
                >
                  <template #prefix>
                    <!--使用自己在assets的svg图标，与上面的文字相配合-->
                    <svg-icon
                        v-if="formData.icon"
                        :icon-class="formData.icon"
                        class="el-input__icon choose_icon_input"
                    ></svg-icon>
                    <el-icon v-else class="choose_icon_input">
                      <Search></Search>
                    </el-icon>
                  </template>
                </el-input>
              </template>

              <!--图标展示，支持点击后选中-->
              <IconSelect ref="iconSelectRef" @select-icon="selectIcon"></IconSelect>
            </el-popover>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="formData.menuName" placeholder="请输入菜单名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="formData.orderNum" controls-position="right" :min="0"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>

                <span>是否外链</span>
              </span>
            </template>

            <el-radio-group v-model="formData.isIframe">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="path">
            <template #label>
              <span>
                <el-tooltip
                    content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                    placement="top"
                >
                  <el-icon><question-filled/></el-icon>
                </el-tooltip>
                路由地址
              </span>
            </template>
            <el-input v-model="formData.path" placeholder="请输入路由地址"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip
                    content="组件地址，放在views下面，比如/system/menu/"
                    placement="top"
                >
                  <el-icon><question-filled/></el-icon>
                </el-tooltip>
                路由地址
              </span>
            </template>
            <el-input v-model="formData.component" placeholder="请输入路由地址"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                    content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                    placement="top"
                >
                  <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                显示状态
              </span>
            </template>
            <el-radio-group v-model="formData.visible">
              <el-radio v-for="dict in sys_show_hide" :key="dict.value" :label="dict.value">
                {{ dict.dictLabel }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                    content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                    placement="top"
                >
                  <el-icon><question-filled/></el-icon>
                </el-tooltip>
                菜单状态
              </span>
            </template>
            <el-radio-group v-model="formData.status">
              <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!--底部部分-->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, ref, computed, watchEffect, watch} from "vue";
import {networkCreateOrUpdateMenu, NetworkMenu} from "@/common/api/menu";
import sysShowHideData from "@/common/mock/system/dict/type/sys_show_hide.json";
import sysNormalDisable from "@/common/mock/system/dict/type/sys_normal_disable.json";
import IconSelect from "@/components/icon-select/icon-select.vue";
import type {FormInstance, FormRules} from 'element-plus'
import {useSubmitForm} from "@/common/hooks/useSubmitForm";
import {MenuDialogForm} from "@/common/api/menu";
import {ElMessage} from "element-plus";

export default defineComponent({
  name: "CreateMenu",
  components: {IconSelect},
  props: {
    menuList: {
      type: Array as PropType<NetworkMenu[]>,
    },
    modelValue: {
      type: Boolean,
    },
    updateItem: {
      type: Object as PropType<NetworkMenu>,
      require: false
    }
  },
  emits: ["close-dialog", "update:modelValue"],
  setup(props, context) {
    const initFormData: MenuDialogForm = {
      parentId: "",
      menuType: "M",
      formData: "",
      orderNum: 1,
      isIframe: "0",
      path: "",
      component: "",
      visible: true,
      status: "",
      menuName: "",
      icon: "",
    }
    const formData = reactive<MenuDialogForm>({...initFormData});

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


    const formRules: FormRules<MenuDialogForm> = {
      menuName: [{required: true, message: "菜单名称不能为空", trigger: "blur"}],
      orderNum: [{required: true, message: "菜单顺序不能为空", trigger: "blur"}],
      path: [{required: true, message: "路由地址不能为空", trigger: "blur"}],
    };

    const dialogTitle = ref("");
    const dialogOpen = computed({
      get: () => {
        return props.modelValue;
      },
      set: (value: any) => {
        context.emit("update:modelValue", value);
      },
    });
    watch(() => dialogOpen.value, (show) => {
      if (!show) {
        // 重置数据
        const keys = Object.keys(initFormData);
        for (const key of keys) {
          formData[key] = initFormData[key];
        }
      }
    });

    const menuOptions = computed(() => {
      const menu = {menuId: 0, menuName: "主类目", children: []} as NetworkMenu;
      menu.children = props.menuList!;
      return [menu];
    });

    const dialogRef = ref<FormInstance>();
    const {checkRulesAndSubmit} = useSubmitForm(dialogRef);
    const submitForm = () => {
      // api/menu提交网络请求
      checkRulesAndSubmit(async () => {
        const addRes = await networkCreateOrUpdateMenu(formData, isUpdate.value);
        let msg = "新增成功";
        if (isUpdate.value) {
          msg = "更新成功";
        }
        ElMessage({message: msg, type: "success", duration: 20 * 1000});
        cancel();
      });
    };
    const cancel = () => {
      context.emit("close-dialog");
    };

    const sys_show_hide = sysShowHideData;
    const sys_normal_disable = sysNormalDisable;

    // ------- 选择图标的相关逻辑 ---------
    const showChooseIcon = ref(false);
    const iconSelectRef = ref();

    const showSelectIcon = () => {
      // 显示弹出的下拉列表
      showChooseIcon.value = true;
      iconSelectRef.value.reset();
    };
    const hideSelectIcon = (event: any) => {
      // 隐藏下拉图标列表
      var elem = event.relatedTarget || event.srcElement || event.target || event.currentTarget;
      var className = elem.className;
      if (className !== "el-input__inner") {
        // 如果点击了el-input输入框，则不关闭
        showChooseIcon.value = false;
      }
    };

    const selectIcon = (icon: string) => {
      formData.icon = icon;
    }

    // ------- 选择图标的相关逻辑 ---------

    return {
      dialogRef,
      selectIcon,
      showChooseIcon,
      showSelectIcon,
      hideSelectIcon,
      dialogTitle,
      dialogOpen,
      formData,
      menuOptions,
      submitForm,
      cancel,
      sys_show_hide,
      sys_normal_disable,
      formRules,
      iconSelectRef,
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
