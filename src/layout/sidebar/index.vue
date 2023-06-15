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
import {useRouter} from "vue-router";

export default defineComponent({
  name: "AppAside",
  components: {SidebarItem, AppAsideHeaderLogo},
  props: {},
  setup() {
    const permissionStore = usePermissionStore();
    const router = useRouter();
    const sidebarRoutes = computed(() => {
      // 一开始在router/initDynamicRoute.ts中动态初始化的路由
      const routes = permissionStore.sidebarRoutes.filter((item) => {
        if (item.meta && item.meta.hidden) {
          return false;
        }
        return true;
      });
      console.warn("sidebarRoutes", routes);
      return routes;
    });

    const handleSelect = (key: string, keyPath: string[]) => {
      // TODO 需要解析出params，然后解析出对应的路径作为key
      router.push(keyPath.join("/"));
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
