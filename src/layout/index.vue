<template>
  <div class="layout-index-wrapper">
    <!--头部区域-->
    <div class="app-header-wrapper">
      <AppHeader></AppHeader>
    </div>

    <!--内容区域，包括侧边菜单栏和右边内容-->
    <div class="app-content-wrapper">
      <AppAside></AppAside>
      <AppContent></AppContent>
    </div>

    <!--底部区域-->
    <div class="app-footer-wrapper">
      <AppFooter></AppFooter>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import AppAside from "./AppAside.vue";
import AppHeader from "./AppHeader.vue";
import AppContent from "./AppContent.vue";
import AppFooter from "./AppFooter.vue";

export default defineComponent({
  name: "LayoutIndex",
  components: {AppFooter, AppContent, AppHeader, AppAside},
  props: {},
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
.layout-index-wrapper {
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
  background-color: rebeccapurple;

  display: flex;
  flex-direction: column;
}

.app-header-wrapper {
  width: 100%;
  height: 20px;
  background-color: red;
}

.app-content-wrapper {
  flex: 1;
  height: 0px;
  width: 100%;
  background-color: green;
}

.app-footer-wrapper {
  width: 100%;
  height: 20px;
  background-color: blue;
}
</style>
