import {createRouter, createWebHashHistory, RouteRecordRaw, RouterOptions} from "vue-router";
import LayoutIndex from "@/layout/index.vue";
// 默认情况下，所有路由是不区分大小写的，并且能匹配带有或不带有尾部斜线的路由
// strict=true，严格要求（导致匹配带有或不带有尾部斜线的路由失效）
// sensitive=true，严格区分大小写
// redirect：重定向的目标，可以使用{name:xxx}或者一个function()
// end：默认为true，其 RegExp 是否应该在末尾加一个 $ 以匹配到末尾

export const notNeedLogin = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/view/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/view/Register.vue"),
  },
];

const basicRouters: RouteRecordRaw[] = [
  {
    path: "/:path(.*)*", // "/:path(.*)*"代表: "/a/b"->params: [ "a", "b" ]
    component: () => import("@/view/error/404.vue"),
  },
  {
    path: "",
    component: LayoutIndex,
    redirect: "/index",
    children: [
      {
        path: "/index",
        component: () => import("@/view/index.vue"),
      },
    ],
  },
  ...notNeedLogin,
] as RouteRecordRaw[];

const routerOptions: RouterOptions = {
  history: createWebHashHistory(),
  routes: basicRouters,
} as RouterOptions;

const router = createRouter(routerOptions);
export default router;
