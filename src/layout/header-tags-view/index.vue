<template>
  <div class="tags-view-wrapper-container">
    <!--提供滑动能力-->
    <ScrollPane class="tags-view-wrapper">
      <router-link v-for="tag in visitedViews" to="getRouteToData(tag)" class="tags-view-item">
        {{ tag.title }}
      </router-link>
    </ScrollPane>
    <!--鼠标右键显示部分-->
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import ScrollPane from "@/layout/header-tags-view/ScrollPane.vue";

export default defineComponent({
  name: "index",
  components: {ScrollPane},
  setup(props, context) {
    const mock = [
      {
        title: "首页",
        path: "/",
      },
      {
        title: "子页面1",
        path: "/",
      },
      {
        title: "子页面2",
        path: "/",
      }
    ];

    const visitedViews = computed(() => {
      return mock;
    });

    const getRouteToData = (view) => {
      return {
        path: view.path,
        query: view.query,
        fullPath: view.fullPath,
      };
    };

    return {
      visitedViews,
      getRouteToData,
    };
  },
});
</script>

<style scoped lang="scss">
.tags-view-wrapper-container {
  width: 100%;
  height: 34px;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;

    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
    }
  }
}
</style>
