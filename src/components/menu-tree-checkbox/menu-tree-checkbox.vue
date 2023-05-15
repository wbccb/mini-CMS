<template>
  <el-form-item label="菜单权限">
    <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">
      展开/折叠
    </el-checkbox>
    <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">
      全选/全不选
    </el-checkbox>
    <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event)">
      父子联动
    </el-checkbox>
    <el-tree
      class="tree-border"
      :data="menuOptions"
      show-checkbox
      ref="menuRef"
      node-key="id"
      :check-strictly="!menuCheckStrictly"
      empty-text="加载中，请稍候"
      :props="{label: 'label', children: 'children'}"
    ></el-tree>
  </el-form-item>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {NetworkCreateRoleTree, networkGetCreateRoleMenuList} from "@/api/role";

export default defineComponent({
  name: "menuTreeCheckBox",
  props: {
    menuCheckStrictly: {
      type: Boolean,
      required: true
    }
  },
  emits: ["change-check-strictly"],
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
      context.emit("change-check-strictly", value);
    };

    const menuOptions = ref<NetworkCreateRoleTree[]>([]);
    onMounted(() => {
      networkGetCreateRoleMenuList().then((res: NetworkCreateRoleTree[]) => {
        menuOptions.value = res;
        console.warn("createRole拿到的菜单是", res);
      });
    });

    return {
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
