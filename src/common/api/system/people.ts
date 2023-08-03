// 查询用户列表
import networkUtil, {ResponseData} from "@/common/utils/networkUtil";
import {NetworkUser, QueryUserListParams, NetworkRole} from "@/common/api/system/role";
import userList from "@/common/mock/system/user/user.json";
import authUser from "@/common/mock/system/role/authUser.json";
import roles from "@/common/mock/system/user/roles.json";
import deepClone from "@/common/utils/deepCloneUtil";

// 去掉部门、保留一个用户名即可
export interface NetworkUser {
  id: string;
  // remark: null | string;
  userId: number;
  // deptId: number;
  userName: string;
  // nickName: string;
  email: string;
  phonenumber: string;
  status: boolean;
  // dept: {
  //   remark: null | string;
  //   deptId: number;
  //   parentId: null | number;
  // };
}

const prefix = "/system";

export function networkGetUserList(
  query: QueryUserListParams
): Promise<ResponseData<NetworkUser[]>> {
  // return new Promise((resolve) => {
  //   // @ts-ignore
  //   const data = authUser as ResponseData<NetworkUser[]>;
  //   resolve(deepClone(data));
  // });
  return networkUtil({
    url: prefix + "/people",
    method: "get",
    params: query,
  });
}

export interface NetworkUserAndRoles {
  code: number;
  msg: string;
  roles: NetworkRole[];
  user: NetworkUser;
}

// 查询该用户可以控制的角色
// 比如超级管理员：分配公司管理员、普通用户
// 比如公司管理员：普通用户
// 比如普通用户：无法分配任何角色
export function networkGetRoleListInAddUser(userId?: string): Promise<NetworkUserAndRoles> {
  const urlUserId = userId || "";

  // return new Promise((resolve) => {
  //   // @ts-ignore
  //   const data = roles as NetworkUserAndRoles;
  //   resolve(deepClone(data));
  // });

  return networkUtil({
    url: prefix + `people/authRole/${urlUserId}`,
    method: "get",
  });
}
