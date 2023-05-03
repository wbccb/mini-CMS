<template>
  <div class="app-header-content">AppHeader区域</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "AppHeader",
  props: {},
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
.app-header-content {
  width: 100%;
  height: 20px;
  background-color: red;
}
</style>
