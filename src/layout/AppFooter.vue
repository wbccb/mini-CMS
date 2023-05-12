<template>
  <div class="app-footer-content">这是Footer</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "AppFooter",
  props: {},
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
.app-footer-content {
  height: 26px;
  line-height: 26px;
}
</style>
