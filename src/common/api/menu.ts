/**
 * 根据账号获取动态路由，进行menu菜单的显示
 */
import networkUtil, {ResponseData} from "@/common/utils/networkUtil";
import systemMenuList from "@/common/mock/system/menu/list.json";
import deepClone from "@/common/utils/deepCloneUtil";
import routesList from "@/common/mock/system/router/list.json";

export interface NetworkRoute {
    alwaysShow: boolean;
    children: Array<NetworkRoute>;
    component: any;
    hidden: boolean;
    meta: { title: string; icon: string; noCache: boolean; link: null | string };
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

export interface MenuDialogForm {
    parentId: string;
    menuType: "M" | "C" | "F";
    formData: string;
    orderNum: number;
    isIframe: "0" | "1";
    path: string;
    visible: boolean;
    status: string;
    menuName: string;
    icon: string;
}

const prefix = "/system";

/**
 * 获取动态路哟
 */
export function networkGetRoutes(): Promise<ResponseData<NetworkRoute[]>> {
    return new Promise((resolve) => {
        const mockData: any = routesList;
        const data = mockData as ResponseData<NetworkRoute>;
        resolve(data);
    });

    // return networkUtil({
    //   url: "/getRouters",
    //   method: "get",
    // });
}


/**
 * 获取所有的菜单列表
 */
export function networkGetMenuList(): Promise<ResponseData<NetworkMenu[]>> {
    return networkUtil({
        url: prefix + '/menu',
        method: "get",
    })
}


export function networkCreateOrUpdateMenu(data: MenuDialogForm, isUpdate = false): Promise<NetworkMenu[]> {
    const method = isUpdate ? "put" : "post";
    return networkUtil({
        url: prefix + '/menu',
        method: method,
        data: data
    });
}


export function networkDeleteMenu(id: number): Promise<NetworkMenu[]> {
    return networkUtil({
        url: prefix + '/menu?id='+id,
        method: "delete"
    });
}



