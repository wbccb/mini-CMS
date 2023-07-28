<template>
  <div class="SidebarItem_wrapper">
    <!--只有一个元素-->
    <template v-if="hasOneShowingChild()">
      <!--一个单纯的链接-->
      <!--      <el-sub-menu :index="item.path">-->
      <!--        <template v-if="item.meta" #title>-->
      <!--          <span>{{ item.meta.title }}</span>-->
      <!--        </template>-->
      <!--      </el-sub-menu>-->
      <el-menu-item :index="item.path">
        {{ item.meta.title }}
      </el-menu-item>
    </template>

    <!--多个元素，可能存在嵌套结构-->
    <template v-else>
      <el-sub-menu :index="item.path">
        <!-- 当前菜单group的标题一行-->
        <template v-if="item.meta" #title>
          <span>{{ item.meta.title }}</span>
        </template>

        <!--当前菜单group的嵌套子children具体的内容-->
        <SidebarItem
          v-for="(child, index) in item.children"
          :key="child.path + index"
          :item="child"
        ></SidebarItem>
      </el-sub-menu>
    </template>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import AppLink from "@/layout/sidebar/AppLink.vue";
import {RouteRecordRaw} from "vue-router";

export default defineComponent({
  name: "SidebarItem",
  components: {AppLink},
  props: {
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true,
    },
    key: {
      type: String,
    },
  },
  setup(props) {
    const hasOneShowingChild = () => {
      const children: RouteRecordRaw[] = props.item.children || [];

      const filterChildren = children.filter((item) => {
        if (item.meta && item.meta.hidden) {
          return false;
        }
        return true;
      });

      if (filterChildren.length <= 1) {
        return true;
      }

      return false;
    };

    return {
      hasOneShowingChild,
    };
  },
});
</script>

<style scoped lang="scss">
.SidebarItem_wrapper {
}
</style>
