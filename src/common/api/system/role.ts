import systemRoleList from "@/common/mock/system/role/list.json";
import deepClone from "@/common/utils/deepCloneUtil";
import createRole from "@/common/mock/system/role/createRole.json";
import authUser from "@/common/mock/system/role/authUser.json";
import unallocatedUserList from "@/common/mock/system/role/unallocatedUserList.json";
import {networkGetMenuTree, NetworkMenu, NetworkMenuTree} from "@/common/api/system/menu";
import {NetworkUserAndRoles} from "@/common/api/system/people";
import {ResponseUser} from "@/store/modules/user";
import networkUtil, {ResponseListData} from "@/common/utils/networkUtil";

export type ResponseRole = {
  id: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
} & RoleDialogForm;
const prefix = "/system";

export function networkGetRoleList(): Promise<ResponseListData<ResponseRole[]>> {
  // return new Promise((resolve) => {
    // @ts-ignore
    // const data = systemRoleList as ResponseListData<ResponseRole[]>;
    // resolve(deepClone(data));
  // });
  return networkUtil({
    url: prefix + "/role",
    method: "get",
  });
}

// 查询菜单下拉树结构
export function networkGetCreateRoleMenuList() {
  // return new Promise((resolve) => {
  //   // @ts-ignore
  //   const data = createRole as ResponseListData<NetworkCreateRoleTree[]>;
  //   resolve(deepClone(data.data));
  // });

  return networkGetMenuTree();
}

export interface QueryUserListParams {
  pageNum: number;
  pageSize: number;
  roleId?: string;
  userName?: undefined;
  phonenumber?: undefined;
  status?: string;
  deptId?: string;
}



export interface RoleDialogForm {
  roleName: string;
  roleKey: string;
  roleSort: number;
  status: string;
  roleType: number;
}

/**
 * 根据roleId查询所有的用户数据
 * 查找该角色的所有用户数据
 * @param query
 */
export function networkGetUserListByRoleId(
  query: QueryUserListParams
): Promise<ResponseListData<ResponseUser[]>> {
  return new Promise((resolve) => {
    // @ts-ignore
    const data = authUser as ResponseListData<NetworkUser[]>;
    resolve(deepClone(data));
  });
  return networkUtil({
    url: "/system/role/authUser/allocatedList",
    method: "get",
    params: query,
  });
}

/**
 * 查询角色未授权用户列表
 * 进行新授权
 * @param query
 */
export function networkGetUnallocatedUserList(
  query: QueryUserListParams
): Promise<NetworkUserAndRoles> {
  return new Promise((resolve) => {
    // @ts-ignore
    const data = authUser as NetworkUserAndRoles;
    resolve(deepClone(data));
  });
  // return networkUtil({
  //   url: '/system/role/authUser/unallocatedList',
  //   method: 'get',
  //   params: query
  // })
}


export function networkCreateOrUpdateRole(
  data: RoleDialogForm,
  isUpdate = false
): Promise<NetworkMenu[]> {
  const method = isUpdate ? "put" : "post";
  return networkUtil({
    url: prefix + "/role",
    method: method,
    data: data,
  });
}

export function networkDeleteRole(id: string): Promise<NetworkMenu[]> {
  return networkUtil({
    url: prefix + "/role?id=" + id,
    method: "delete",
  });
}