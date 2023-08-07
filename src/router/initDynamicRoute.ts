import NProgress from "nprogress";
import router, {notNeedLogin} from "./index";
import {getToken, removeToken} from "@/common/utils/tokenUtil";
import {RouteLocationNamedRaw, RouteLocationNormalized, NavigationGuardNext} from "vue-router";
import useUserStore from "@/store/modules/user";
import networkUtil from "@/common/utils/networkUtil";
import usePermissionStore from "@/store/modules/permission";
import {isHttp} from "@/common/utils/validateUtil";

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
        // 有token的情况下，把token放在cookies中进行用户信息的获取
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
        // 使用token进行数据和动态路由的获取
        const userStore = useUserStore(); // pinia可以在任意地方使用store
        if (userStore && userStore.roles && userStore.roles.length === 0) {
            console.error("检测到roles为空，需要进行登录获取");
            handleDynamicRoute(to, from, next);
        } else {
            // 已经合并过动态路由
            next();
        }
    }
}

/**
 * 登录情况下，进行userInfo的获取和动态路由的获取
 */
async function handleDynamicRoute(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    try {
        await userStore.storeGetInfo(); // store进行用户信息的获取

        // TODO 如果token无效或者过期，则应该next("/login")

        const {dynamicAccessRoutes, rewriteRoutes} = await permissionStore.storeGetRoutes();

        console.info("前端中可以访问的路由，是已经写死的部分", dynamicAccessRoutes);
        console.info("网络请求拿到的路由列表", rewriteRoutes);

        // 写死的前端路由
        dynamicAccessRoutes.forEach((route) => {
            console.info("前端写的路由数据为：", route);
            // router.addRoute(route);
        });

        console.error("handleDynamicRoute触发");

        // 动态创建菜单所产生的路由列表
        rewriteRoutes.forEach((route) => {
            if (!isHttp(route.path)) {
                console.warn("网络请求getRouters拿到的路由是：", route);
                router.addRoute(route);
            }
        });

        const tempRouters = router.getRoutes();
        console.error("目前能拿到的所有路由数据是", tempRouters);

        // TODO 要考虑动态addRoute没有实时生效的问题
        next(
            {
                path: "/",
                replace: true
            }
        );
    } catch (e) {
        console.error("获取动态路由失败", e);
        removeToken();
        next(
          {
              path: "/login",
              replace: true
          }
        );
    }
}

router.afterEach(() => {
    NProgress.done();
});
