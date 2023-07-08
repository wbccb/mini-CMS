<template>
  <div class="app-header-wrapper">
    <div class="left-wrapper">
      <div class="left-menu-wrapper">
        <Hamburger @toggle-click="toggleClick"/>
      </div>

      <div class="left-breadcrumb-wrapper">
        <Breadcrumb/>
      </div>
    </div>

    <div class="right-wrapper">
      <div class="right-menu">
        <el-button @click="clickToLogout">退出登录</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Hamburger from "@/layout/header/Hamburger.vue";
import Breadcrumb from "@/layout/header/Breadcrumb.vue";
import useAppStore from "@/store/modules/app";
import {logout} from "@/common/api/login";
import useUserStore from "@/store/modules/user";
import {useMyRouter} from "@/common/hooks/useMyRouter";
import {ElMessage} from "element-plus";

export default defineComponent({
  name: "AppHeader",
  components: {Breadcrumb, Hamburger},
  props: {},
  setup() {
    const appStore = useAppStore();
    const toggleClick = () => {
      // 切换侧边栏显示和隐藏功能
      appStore.toggleSideBar(false);
    };

    const userStore = useUserStore();
    const {goToLogin} = useMyRouter();
    const clickToLogout = async () => {
      // TODO 全局try-catch后期需要处理
      try {
        await userStore.storeLogout();
        goToLogin();
        ElMessage({
          type: "success",
          message: "登出成功",
        });
      } catch (e) {
        ElMessage({
          type: "error",
          message: "登出失败",
        });
      }

    }
    return {
      toggleClick,
      clickToLogout
    };
  },
});
</script>

<style scoped lang="scss">
.app-header-wrapper {
  width: 100%;
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .left-wrapper {

    display: flex;
    flex-direction: row;

    .left-menu-wrapper {
      box-sizing: border-box;
      overflow: hidden;
      box-sizing: border-box;
    }

    .left-breadcrumb-wrapper {
      flex: 1;
      box-sizing: border-box;
      overflow: hidden;
    }
  }

  .right-wrapper {
    .right-menu {
      margin: 10px;
    }
  }
}
</style>
