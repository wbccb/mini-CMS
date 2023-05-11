<template>
    <div class="layout-index-wrapper">
        <!--左侧侧边栏-->
        <div class="app-left-wrapper">
            <AppAside></AppAside>
        </div>

        <!--右侧侧边栏-->
        <div class="app-right-wrapper">
            <AppHeader></AppHeader>
            <AppContent></AppContent>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import AppAside from "@/layout/sidebar/SiderBar.vue";
import AppHeader from "./AppHeader.vue";
import AppContent from "./AppContent.vue";
import AppFooter from "./AppFooter.vue";
import useAppStore from "@/store/modules/app";

export default defineComponent({
    name: "LayoutIndex",
    components: { AppFooter, AppContent, AppHeader, AppAside },
    props: {},
    setup() {
        // TODO 侧边栏的样式和数据构建布局
        // TODO AppHeader顶部的左侧收缩组件 + 面包屑也就是多级菜单栏显示
        const appStore = useAppStore();
        const sider = computed(() => {
            return appStore.sidebar;
        });

        return {
            sider,
        };
    },
});
</script>

<style scoped lang="scss">
.layout-index-wrapper {
    position: fixed;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;

    display: flex;
    flex-direction: row;

    .app-left-wrapper {
        transition: width 0.28s;
        width: 200px;
        height: 100%;
        position: absolute;
        font-size: 0px;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
        overflow: hidden;
    }

    .app-right-wrapper {
        flex: 1;
        height: 100%;
        transition: margin-left 0.28s;
        margin-left: 200px;
        position: relative;

        background-colo: green;
    }
}
</style>
