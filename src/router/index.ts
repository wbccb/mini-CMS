import {createRouter, createWebHashHistory, RouteRecordRaw, RouterOptions} from "vue-router";
import LayoutIndex from "@/layout/index.vue";

// 默认情况下，所有路由是不区分大小写的，并且能匹配带有或不带有尾部斜线的路由
// strict=true，严格要求（导致匹配带有或不带有尾部斜线的路由失效）
// sensitive=true，严格区分大小写
// redirect：重定向的目标，可以使用{name:xxx}或者一个function()
// end：默认为true，其 RegExp 是否应该在末尾加一个 $ 以匹配到末尾

export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/system/user-auth",
    component: LayoutIndex,
    children: [
      {
        path: "role/:userId(\\d+)", // :userId(\d+) -> 仅匹配数字，可以拿到params:数字
        name: "AuthRole",
        component: () => import("@/view/system/user/authRole.vue"),
        meta: {title: "分配角色1", activeMenu: "/system/user"},
      },
      {
        path: "role/:userId(\\d+)", // :userId(\d+) -> 仅匹配数字，可以拿到params:数字
        name: "AuthRole",
        component: () => import("@/view/system/user/authRole.vue"),
        meta: {title: "分配角色2", activeMenu: "/system/user"},
      },
    ],
    meta: {
      permissions: ["system:user:edit"],
      title: "系统",
    },
  },
  {
    path: "/system/dict-data",
    component: LayoutIndex,
    permissions: ["system:dict:list"],
    meta: {
      hidden: true,
      title: "字典数据",
    },
    children: [
      {
        path: "index/:dictId(\\d+)",
        component: () => import("@/view/system/dict/data.vue"),
        name: "Data",
        meta: {title: "字典数据1", activeMenu: "/system/dict"},
      },
      {
        path: "index/:dictId(\\d+)",
        component: () => import("@/view/system/dict/data.vue"),
        name: "Data",
        meta: {title: "字典数据2", activeMenu: "/system/dict"},
      },
    ],
  },
] as RouteRecordRaw[];

export const notNeedLogin: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/view/Login.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/view/Register.vue"),
    meta: {
      hidden: true,
    },
  },
] as RouteRecordRaw[];

export const basicRouters: RouteRecordRaw[] = [
  {
    path: "/:path(.*)*", // "/:path(.*)*"代表: "/a/b"->params: [ "a", "b" ]
    component: () => import("@/view/error/404.vue"),
    meta: {
      hidden: true,
    },
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
    meta: {
      title: "首页",
    },
  },
  ...notNeedLogin,
] as RouteRecordRaw[];

const routerOptions: RouterOptions = {
  history: createWebHashHistory(),
  routes: basicRouters,
} as RouterOptions;

const router = createRouter(routerOptions);
export default router;
