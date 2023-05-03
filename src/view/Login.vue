<template>
  <div class="login-wrapper">这是Login页面</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "login",
  props: {},
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
.login-wrapper {
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
}
</style>
