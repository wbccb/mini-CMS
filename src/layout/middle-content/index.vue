<template>
  <div class="app-content-container">
    <router-view v-slot="{Component, route}">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "AppContent",
  props: {},
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
.app-content-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 20px;

  background-color: red;
}
</style>
