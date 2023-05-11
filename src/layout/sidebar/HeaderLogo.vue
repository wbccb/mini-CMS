<template>
  <div class="sidebar-header-logo">
    <a href="/">
      <span class="sidebar-header-logo_text">这是logo位置</span>
    </a>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "AppAsideHeaderLogo",
  props: {},
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
.sidebar-header-logo {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;
  color: #ffffff;
  font-size: 14px;


  .sidebar-header-logo_text {
    font-size: 14px;
    color: #ffffff;
  }
}
</style>
