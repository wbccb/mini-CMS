<template>
  <div class="app-aside-content">这是侧边菜单栏</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "AppAside",
  props: {},
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
.app-aside-content {
  width: 100px;
  height: 100%;
  background-color: yellow;
}
</style>
