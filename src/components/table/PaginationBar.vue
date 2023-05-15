<template>
  <el-pagination
    class="main-pagination"
    background
    layout="total, sizes, prev, pager, next, jumper, slot, -> ">
  </el-pagination>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "PaginationBar",
  setup() {
    const currentPage = ref<number>(1);
    const pageSizes = ref<number[]>([10, 20, 50, 100]);

    return {
      currentPage,
      pageSizes
    }
  }
})
</script>

<style scoped>

</style>