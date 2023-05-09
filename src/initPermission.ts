import NProgress from "nprogress";
import router, {notNeedLogin} from "./router/index";
import {getToken, removeToken} from "@/utils/tokenUtil";
import {RouteLocationNamedRaw, RouteLocationNormalized, NavigationGuardNext} from "vue-router";
import useUserStore from "@/store/modules/user";
import networkUtil from "@/utils/networkUtil";
import usePermissionStore from "@/store/modules/permission";
import {isHttp} from "@/utils/validateUtil";

// 不需要跳转的路由notNeedLogin
const notNeedLoginPath = notNeedLogin.map((item) => {
  return item.path;
});

// 检测是否已经登录，如果没有登录则跳转到注册/登录页面，如果已经登录，则next()
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (!getToken()) {
    if (notNeedLoginPath.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  } else {
    handleAlreadyLogin(to, from, next);
  }
});

function handleAlreadyLogin(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // 已经登录的情况，重新进入页面
  if (to.path === "/login") {
    next({path: "/"});
    NProgress.done();
  } else {
    // 跳转到path: "/"页面
    // 检测是否获取userInfo数据，因为根据账户获取动态路由
    const userStore = useUserStore(); // pinia可以在任意地方使用store
    if (userStore.roles.length === 0) {
      handleDynamicRouter(to, from, next);
    } else {
      // 已经合并过动态路由
      next();
    }
  }
}

/**
 * 登录情况下，进行userInfo的获取和动态路由的获取
 */
async function handleDynamicRouter(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  try {
    const res = await userStore.storeGetInfo();
    const {dynamicAccessRoutes, rewriteRoutes} = await permissionStore.storeGetRoutes();

    // 写死的前端路由
    dynamicAccessRoutes.forEach((route) => {
      router.addRoute(route);
    });

    // 动态创建菜单所产生的路由列表
    rewriteRoutes.forEach((route) => {
      if (!isHttp(route.path)) {
        router.addRoute(route);
      }
    });

    // TODO 要考虑动态addRoute没有实时生效的问题
    next({...to, replace: true});
  } catch (e) {
    console.error("获取动态路由失败", e);
  }
}

router.afterEach(() => {
  NProgress.done();
  removeToken();
});
