// 查询用户列表
import networkUtil, {ResponseListData} from "@/common/utils/networkUtil";
import {QueryUserListParams, ResponseRole} from "@/common/api/system/role";
import userList from "@/common/mock/system/user/user.json";
import authUser from "@/common/mock/system/role/authUser.json";
import roles from "@/common/mock/system/user/roles.json";
import deepClone from "@/common/utils/deepCloneUtil";
import {ResponseUser} from "@/store/modules/user";


const prefix = "/user";

export function networkGetUserList(
  query: QueryUserListParams
): Promise<ResponseListData<ResponseUser[]>> {
  // return new Promise((resolve) => {
  //   // @ts-ignore
  //   const data = authUser as ResponseListData<NetworkUser[]>;
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
  roles: ResponseRole[];
  user: ResponseUser;
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
