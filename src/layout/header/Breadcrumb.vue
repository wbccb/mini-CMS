<template>
  <el-breadcrumb class="breadcrumb-wrapper" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="index">
        <!--          没有重定向或者是最后一个元素，则使用span-->
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1">
          {{ item.meta.title }}
        </span>
        <!--          有重定向就使用a-->
        <a v-else>{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {RouteMeta, RouteRecord, useRoute, useRouter} from "vue-router";

export default defineComponent({
  name: "Breadcrumb",
  props: {},
  setup() {
    // <TransitionGroup> 是一个内置组件，用于对 v-for 列表中的元素或组件的插入、移除和顺序改变添加动画效果

    // 通过matched访问meta字段
    // 或者通过$route.meta访问

    const levelList = ref<RouteRecord[]>([]);
    // 复习下watchEffect的源码以及对应的set、get流程
    const router = useRouter();
    const route = useRoute(); // 持有当前路由的响应式对象
    watch(
      () => router.currentRoute.value.fullPath,
      () => {
        refreshLevelList();
      }
    );

    onMounted(() => {
      refreshLevelList();
    });

    const refreshLevelList = () => {
      // 更新levelList数据

      // 先拼凑个首页上去
      const newArray: RouteRecord[] = [
        {
          path: "/",
          meta: {
            title: "首页",
          },
        } as RouteRecord
      ];

      // 记录每一个子路由的信息
      const matched = route.matched;
      levelList.value = newArray.concat(
        matched.filter((item) => {
          return item.meta && item.meta.title && item.meta.breadcrumb !== false;
        })
      );
    };

    return {
      levelList,
    };
  },
});
</script>

<style lang="scss" scoped>
.breadcrumb-wrapper {
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;
}
</style>
