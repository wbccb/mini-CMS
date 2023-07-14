import {defineStore} from "pinia";
import {networkGetRoutes, NetworkRoute} from "@/common/api/system/menu";
import {filterDynamicRoutes} from "@/common/utils/routeUtil";
import router, {dynamicRoutes, basicRouters} from "@/router";
import {RouteRecordRaw} from "vue-router";
import useUserStore from "@/store/modules/user";
import LayoutIndex from "@/layout/index.vue";
import ParentView from "@/components/parent-view/parent-view.vue";
import InnerLink from "@/components/inner-link/inner-link.vue";
import deepClone from "@/common/utils/deepCloneUtil";
import {ResponseData} from "@/common/utils/networkUtil";

type NetworkResponseRoute = ResponseData<NetworkRoute>;

interface PermissionState {
  routes: RouteRecordRaw[];
  addRoutes: RouteRecordRaw[];
  defaultRoutes: RouteRecordRaw[];
  topbarRoutes: RouteRecordRaw[];
  sidebarRoutes: RouteRecordRaw[];
}

const usePermissionStore = defineStore({
  id: "permission",
  state: (): PermissionState => {
    return {
      routes: [],
      addRoutes: [],
      defaultRoutes: [],
      topbarRoutes: [],
      sidebarRoutes: [],
    };
  },
  actions: {
    setSidebarRouters(routes: RouteRecordRaw[]) {
      console.log("setSidebarRouters", routes);
      this.sidebarRoutes = routes;
    },
    // 根据权限拼接路由
    async storeGetRoutes() {
      const res = await networkGetRoutes();
      const rdata = deepClone(res.data);
      const sdata = deepClone(res.data);

      // filterAsyncRouter:
      // 1.暂时屏蔽link链接的路由
      // 2.构建route.component对象
      // 3.递归route.children进行上面流程的处理
      const rewriteRoutes = this.filterAsyncRouter(rdata, false, true);
      const sidebarRoutes = this.filterAsyncRouter(sdata);

      // 根据router路由的permission和roles跟目前用户持有的permission和roles比对
      // 获取当前用户可以操作的动态路由
      const asyncRoutes = (await this.filterDynamicRoutes(dynamicRoutes)) as RouteRecordRaw[];

      // @ts-ignore
      const newRoutes = basicRouters.concat(sidebarRoutes as RouteRecordRaw[]);
      this.setSidebarRouters(newRoutes);

      return {
        dynamicAccessRoutes: asyncRoutes, // 前端中可以访问的路由，是已经写死的部分
        rewriteRoutes: rewriteRoutes, // 网络请求拿到的路由列表
      };
    },
    filterAsyncRouter(routeMap: NetworkRoute[], lastRouter = false, type = false) {
      return routeMap.filter((route) => {
        if (type && route.children) {
          route.children = filterChildren(route.children);
        }
        if (route.component) {
          // Layout ParentView 组件特殊处理
          if (route.component === "Layout") {
            route.component = LayoutIndex;
          } else if (route.component === "ParentView") {
            route.component = ParentView;
          } else if (route.component === "InnerLink") {
            route.component = InnerLink;
          } else {
            route.component = loadView(route.component);
          }
        }

        if (route.meta.link) {
          // TODO 暂时屏蔽link链接的路由
          return false;
        }

        if (route.children != null && route.children && route.children.length) {
          route.children = this.filterAsyncRouter(route.children, route, type);
        } else {
          route["children"] = [];
          route["redirect"] = "";
        }
        return true;
      });
    },
    async filterDynamicRoutes(routes: RouteRecordRaw[]) {
      const res: RouteRecordRaw[] = [];
      for (let route of routes) {
        // route.permissions = ["system:user:edit"],
        const permission: string[] = ((route.meta && route.meta.permissions) || []) as string[];
        const roles: string[] = ((route.meta && route.meta.roles) || []) as string[];
        if (permission && this.checkRoutePermission(permission)) {
          // 检测用户拿到的权限是否包含着某一个路由的权限(只要有触及即可，不要求全包括，因为我们要显示一个菜单，那必须有一定权限操作该菜单)
          res.push(route);
        } else if (roles && this.checkRouteRole(roles)) {
          res.push(route);
        }
      }
      return res;
    },
    checkRoutePermission(routePermissions: string[]) {
      // 用户拿到的权限只要有一个是routePermissions的权限，就可以显示该路由
      const userStore = useUserStore();
      const userPermissions = userStore.permissions;

      function checkRoutePermission1(routePermission: string, userPermissions: string[]) {
        const allPermission = "*:*:*";
        if (!userPermissions || userPermissions.length <= 0) {
          return false;
        }
        return userPermissions.some((v) => {
          return allPermission === v || v === routePermission;
        });
      }

      return routePermissions.some((routePermission) => {
        return checkRoutePermission1(routePermission, userPermissions);
      });
    },
    checkRouteRole(routeRoles: string[]) {
      // 某一个菜单可以被多个角色访问
      // 用户可以拥有多个角色，只要用户的某一个角色能够命中某一个菜单的角色，就可以显示出来
      const userStore = useUserStore();
      const userRoles = userStore.roles;

      function checkRouteRole1(routeRole: string, userRoles: string[]) {
        const superAdmin = "admin";

        if (!Array.isArray(userRoles) || userRoles.length <= 0) {
          return false;
        }

        return userRoles.some((v) => {
          // 如果用户是超级管理员或者拥有的角色列表符合该routeRole
          return superAdmin === v || routeRole === v;
        });
      }

      return routeRoles.some((routeRole) => {
        return checkRouteRole1(routeRole, userRoles);
      });
    },
  },
});

function filterChildren(childrenMap: any[], lastRouter = false) {
  let children: any[] = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === "ParentView" && !lastRouter) {
        el.children.forEach((c) => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("./../../views/**/*.vue");
export const loadView = (view: string) => {
  // TODO 需要声明为Component类型
  let res: any = undefined;
  // modules = {"../../views/Login.vue": () => import("/src/views/Login.vue")}
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0];
    if (dir === view) {
      // modules[path] = ()=> import(view)
      // modules[path]就是直接获取对应的Component
      res = () => modules[path]();
    }
  }
  console.info("动态加载组件", res);
  return res;
};

export default usePermissionStore;
