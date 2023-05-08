import NProgress from "nprogress";
import router, {notNeedLogin} from "./router/index";

// 不需要跳转的路由notNeedLogin
const notNeedLoginPath = notNeedLogin.map((item) => {
  return item.path;
});

// 检测是否已经登录，如果没有登录则跳转到注册/登录页面，如果已经登录，则next()
router.beforeEach((to, from, next) => {
  NProgress.start();

  if (notNeedLoginPath.includes(to.path)) {
    next();
  } else {
    next("/login");
  }
});
