import networkUtil, {ResponseData} from "@/common/utils/networkUtil";
import systemRoleList from "@/common/mock/system/role/list.json";
import deepClone from "@/common/utils/deepCloneUtil";
import createRole from "@/common/mock/system/role/createRole.json";
import authUser from "@/common/mock/system/role/authUser.json";
import unallocatedUserList from "@/common/mock/system/role/unallocatedUserList.json";
import {networkGetMenuTree, NetworkMenuTree} from "@/common/api/system/menu";

export interface NetworkRole {
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  remark: string;
  roleId: string;
  roleName: string;
  roleKey: string;
  roleSort: number;
  dataScope: number;
  menuCheckStrictly: boolean;
  deptCheckStrictly: boolean;
  status: string;
  delFlag: string;
  flag: boolean;
  menuIds: null | string[];
  deptIds: null | string[];
  permissions: null | string[];
  admin: boolean;
}
const prefix = "/system";

export function networkGetRoleList(): Promise<ResponseData<NetworkRole[]>> {
  return new Promise((resolve) => {
    // @ts-ignore
    const data = systemRoleList as ResponseData<NetworkRole[]>;
    resolve(deepClone(data));
  });
}

// 查询菜单下拉树结构
export function networkGetCreateRoleMenuList() {
  // return new Promise((resolve) => {
  //   // @ts-ignore
  //   const data = createRole as ResponseData<NetworkCreateRoleTree[]>;
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

export interface NetworkRoleUser {
  remark: null | string;
  userId: number;
  deptId: number;
  userName: string;
  nickName: string;
  email: string;
  phonenumber: string;
  status: string;
  dept: {
    remark: null | string;
    deptId: number;
    parentId: null | number;
  };
}

/**
 * 根据roleId查询所有的用户数据
 * 查找该角色的所有用户数据
 * @param query
 */
export function networkGetUserListByRoleId(
  query: QueryUserListParams
): Promise<ResponseData<NetworkRoleUser[]>> {
  return new Promise((resolve) => {
    // @ts-ignore
    const data = authUser as ResponseData<NetworkRoleUser[]>;
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
