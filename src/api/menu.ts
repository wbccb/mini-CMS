/**
 * 根据账号获取动态路由，进行menu菜单的显示
 */
import networkUtil from "@/utils/networkUtil";

export const networkGetRoutes = () => {
  return networkUtil({
    url: "/getRouters",
    method: "get",
  });
};
