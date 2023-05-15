import networkUtil, {ResponseData} from "@/utils/networkUtil";
import systemRoleList from "@/common/mock/system/role/list.json";
import deepClone from "@/utils/deepCloneUtil";
import createRole from "@/common/mock/system/role/createRole.json";

export interface NetworkRole {
  "createBy": string;
  "createTime": string;
  "updateBy": string;
  "updateTime": string;
  "remark": string;
  "roleId": string;
  "roleName": string;
  "roleKey": string;
  "roleSort":  number;
  "dataScope":  number;
  "menuCheckStrictly": boolean;
  "deptCheckStrictly": boolean;
  "status": string;
  "delFlag": string;
  "flag": boolean;
  "menuIds": null | string[];
  "deptIds": null | string[];
  "permissions": null | string[];
  "admin": boolean;
}
export function networkGetRoleList(): Promise<ResponseData<NetworkRole[]>> {
  return new Promise((resolve)=> {
    // @ts-ignore
    const data = systemRoleList as ResponseData<NetworkRole[]>;
    resolve(deepClone(data));
  });
}


export interface NetworkCreateRoleTree {
  children: NetworkCreateRoleTree[];
  id: number;
  label: string;
}
// 查询菜单下拉树结构
export function networkGetCreateRoleMenuList() {
  return new Promise((resolve)=> {
    // @ts-ignore
    const data = createRole as ResponseData<NetworkCreateRoleTree[]>;
    resolve(deepClone(data.data));
  });

  // return networkUtil({
  //   url: '/system/menu/treeselect',
  //   method: 'get'
  // })
}