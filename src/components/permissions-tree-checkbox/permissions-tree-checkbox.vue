<template>
  <el-form-item label="菜单权限字符">
    <el-tree
        class="tree-border"
        :data="menuOptions"
        show-checkbox
        ref="menuRef"
        node-key="id"
        :check-strictly="false"
        empty-text="加载中，请稍候"
        :props="{label: 'label', children: 'children'}"
    ></el-tree>
  </el-form-item>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, ref, watch, watchEffect} from "vue";
import {networkGetCreateRoleMenuList} from "@/common/api/system/role";
import {ResponseListData} from "@/common/utils/networkUtil";
import {MenuTypeEnum, ResponseMenuTree} from "@/common/api/system/menu";
import useUserStore from "@/store/modules/user";
import {RoleType} from "@/common/utils/CONST";

export default defineComponent({
  name: "permissionTreeCheckBox",
  props: {
    checkData: {
      type: Array as PropType<ResponseMenuTree[]>
    }
  },
  setup(props, context) {
    const menuRef = ref();

    const menuExpand = ref(false);
    const menuNodeAll = ref(false);
    const menuCheckStrictly = ref(false);
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
      // form.menuCheckStrictly = value ? true : false;
      context.emit("update:menuCheckStrictly", value);
    };

    const menuOptions = ref<ResponseMenuTree[]>([]);
    const userStore = useUserStore();
    onMounted(async () => {
      const res = await networkGetCreateRoleMenuList();
      const arrayData = res.data as ResponseMenuTree[];
      for (let item of arrayData) {
        addChildrenSomePermission(item);
      }
      menuOptions.value = arrayData;
      console.warn("createRole拿到的菜单是", res);

      // TODO 拿到的路由都是 id: {children:{id}}的数据结构，还需要初始化路由时进行 [id]: {url}的映射

      // TODO 根据登录用户的roleType进行筛选
      const user = userStore.user!.id;
    });

    function addChildrenSomePermission(item: ResponseMenuTree) {
      if (item.menuType !== MenuTypeEnum.内层按钮 && item.children) {
        for (const children of item.children) {
          addChildrenSomePermission(children);
        }
      } else if (item.menuType === MenuTypeEnum.内层按钮) {
        // 判断自己是超级管理员还是系统管理员

        const roleId = useUserStore().user.roleId;
        if (roleId === RoleType.系统管理员) {
          item.children = [
            {
              id: "add",
              label: "add" + "_" + item.path
            },
            {
              id: "update",
              label: "update" + "_" + item.path
            }
          ]
        } else {

          item.children = [
            {
              id: "add" + "_" + item.path,
              label: "add" + "_" + item.path,
              isPermission: true
            },
            {
              id: "update" + "_" + item.path,
              label: "update" + "_" + item.path,
              isPermission: true
            },
            {
              id: "delete" + "_" + item.path,
              label: "delete" + "_" + item.path,
              isPermission: true
            }
          ]
        }

      }
    }

    watch(() => props.checkData, (newValue) => {
      menuRef.value.setCheckedNodes(newValue);
    });

    function getPermissionData() {
      const data = menuRef.value.getCheckedNodes();
      const filterData = data.filter(item=> !!item.isPermission);
      let permissions = [];
      for(const item of filterData) {
        permissions.push(item.id);
      }

      return permissions.join(",");
    }


    return {
      menuExpand,
      menuNodeAll,
      menuCheckStrictly,
      menuRef,
      menuOptions,
      handleCheckedTreeExpand,
      handleCheckedTreeNodeAll,
      handleCheckedTreeConnect,
      getPermissionData
    };
  },
});
</script>

<style scoped lang="scss"></style>
