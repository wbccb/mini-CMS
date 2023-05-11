<template>
  <div class="app-aside-content">
    <AppAsideHeaderLogo></AppAsideHeaderLogo>
    <el-scrollbar>
      <el-menu @select="handleSelect" mode="vertical">
        <!--每一个菜单group的具体内容-->
        <SidebarItem
          v-for="(route, index) in sidebarRoutes"
          :key="route.path + index"
          :item="route"
        ></SidebarItem>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import AppAsideHeaderLogo from "./HeaderLogo.vue";
import SidebarItem from "./SidebarItem.vue";
import usePermissionStore from "@/store/modules/permission";

export default defineComponent({
  name: "AppAside",
  components: {SidebarItem, AppAsideHeaderLogo},
  props: {},
  setup() {
    const permissionStore = usePermissionStore();
    const sidebarRoutes = computed(() => {
      // 一开始在router/initDymamicRoute.ts中动态初始化的路由
      return permissionStore.sidebarRoutes.filter((item) => {
        if (item.meta && item.meta.hidden) {
          return false;
        }
        return true;
      });
    });

    const handleSelect = (key: string, keyPath: string[]) => {
      console.log("handleSelect选择的是", key, keyPath);
      // TODO 需要解析出params，然后解析出对应的路径作为key
    };

    return {
      sidebarRoutes,
      handleSelect,
    };
  },
});
</script>

<style scoped lang="scss">
.app-aside-content {
  width: 100%;
  height: 100%;
}
</style>
