<template>
  <el-form-item label="菜单权限">
    <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">
      展开/折叠
    </el-checkbox>
    <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">
      全选/全不选
    </el-checkbox>
    <el-tree
        class="tree-border"
        :data="menuOptions"
        show-checkbox
        ref="menuRef"
        node-key="id"
        :check-strictly="false"
        empty-text="加载中，请稍候"
        @check-change="checkChange"
        :props="{label: 'label', children: 'children'}"
    ></el-tree>
  </el-form-item>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {networkGetCreateRoleMenuList} from "@/common/api/system/role";
import {ResponseListData} from "@/common/utils/networkUtil";
import {ResponseMenuTree} from "@/common/api/system/menu";
import useUserStore from "@/store/modules/user";

export default defineComponent({
  name: "menuTreeCheckBox",
  emits: ["checkedNodes"],
  props: {},
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
      menuOptions.value = res.data
    });


    const checkChange = () => {
      const checkedNodes = menuRef.value.getCheckedNodes();
      context.emit("checkedNodes", checkedNodes);
    }


    return {
      checkChange,
      menuExpand,
      menuNodeAll,
      menuCheckStrictly,
      menuRef,
      menuOptions,
      handleCheckedTreeExpand,
      handleCheckedTreeNodeAll,
      handleCheckedTreeConnect,
    };
  },
});
</script>

<style scoped lang="scss"></style>
