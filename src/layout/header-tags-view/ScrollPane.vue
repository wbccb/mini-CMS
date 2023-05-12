<template>
  <el-scrollbar>
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ScrollPane",
});
</script>

<style scoped lang="scss"></style>
