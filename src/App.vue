<template>
  <router-view />
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {useMyRouter} from "@/common/hooks/useMyRouter";

export default defineComponent({
  setup() {

    const {goToMenuIndex, goToRoleIndex} = useMyRouter();
    onMounted(() => {
      setTimeout(() => {
        goToRoleIndex();
      }, 500);
    });

  },
});
</script>

<style scoped></style>
