<template>
  <div class="index_wrapper">这是首页</div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import router from "@/router";
import {useRouter} from "vue-router";
import {useMyRouter} from "@/common/hooks/useMyRouter";

export default defineComponent({
  name: "viewIndex",
  props: {},
  setup() {

    const {goToMenuIndex} = useMyRouter();
    onMounted(() => {
      setTimeout(()=> {
        goToMenuIndex();
      }, 1000);
    });

    return {}
  }
});
</script>

<style scoped lang="scss">
.index_wrapper {
  width: 100%;
  height: 100%;
}
</style>
