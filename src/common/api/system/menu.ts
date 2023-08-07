/**
 * 根据账号获取动态路由，进行menu菜单的显示
 */
import networkUtil, {ResponseListData} from "@/common/utils/networkUtil";
import deepClone from "@/common/utils/deepCloneUtil";
import routesList from "@/common/mock/system/router/list.json";
import createRole from "@/common/mock/system/role/createRole.json";

export interface NetworkRoute {
  alwaysShow: boolean;
  children: Array<NetworkRoute>;
  component: any;
  hidden: boolean;
  meta: {title: string; icon: string; noCache: boolean; link: null | string};
  name: string;
  path: string;
  redirect: string | undefined;
}

export interface NetworkMenu {
  children: NetworkMenu[];
  component: any;
  createTime: string;
  icon: string;
  isCache: string;
  isFrame: string;
  menuId: number;
  menuName: string;
  menuType: string;
  orderNum: number;
  parentId: number;
  parentName: null | string;
  path: string;
  perms: string;
  query: string;
  status: string;
  visible: string;
}

export enum MenuTypeEnum {
  "最外层菜单" = "menu",
  "内层菜单" = "subMenu",
  "内层按钮" = "button"
}


export interface RequestMenu {
  parentId: string;
  menuType: MenuTypeEnum;
  formData: string;
  orderNum: number;
  isIframe: boolean;
  path: string;
  component: string;
  visible: boolean;
  status: boolean;
  menuName: string; // 菜单显示的名称
  name: string; // 路由名称
  icon: string;
}

export interface ResponseMenuTree {
  children: ResponseMenuTree[];
  id: number;
  label: string;
}

const prefix = "/system";

/**
 * 获取动态路由
 */
export function networkGetRoutes(): Promise<ResponseListData<NetworkRoute[]>> {
  // return new Promise((resolve) => {
  //   const mockData: any = routesList;
  //   const data = mockData as ResponseListData<NetworkRoute>;
  //   resolve(data);
  // });

  return networkUtil({
    url: prefix + "/menu/routes",
    method: "get",
  });
}

/**
 * 获取所有的菜单列表
 */
export function networkGetMenuList(): Promise<ResponseListData<NetworkMenu[]>> {
  return networkUtil({
    url: prefix + "/menu",
    method: "get",
  });
}

export function networkCreateOrUpdateMenu(
  data: RequestMenu,
  isUpdate = false
): Promise<NetworkMenu[]> {
  const method = isUpdate ? "put" : "post";
  return networkUtil({
    url: prefix + "/menu",
    method: method,
    data: data,
  });
}

export function networkDeleteMenu(id: number): Promise<NetworkMenu[]> {
  return networkUtil({
    url: prefix + "/menu?id=" + id,
    method: "delete",
  });
}

/**
 * 获取menu的树状结构，可以参考createRole的mock数据
 * @param id
 */
export function networkGetMenuTree(): Promise<ResponseListData<ResponseMenuTree[]>> {
  return networkUtil({
    url: prefix + "/menu/treeselect",
    method: "get",
  });
}
