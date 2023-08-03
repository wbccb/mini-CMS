<template>
  <router-view />
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {useMyRouter} from "@/common/hooks/useMyRouter";

export default defineComponent({
  setup() {

    const {goToMenuIndex, goToRoleIndex, goToUserIndex} = useMyRouter();
    // onMounted(() => {
    //   setTimeout(() => {
    //     goToUserIndex();
    //   }, 500);
    // });

  },
});
</script>

<style scoped></style>
