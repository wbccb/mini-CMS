// 查询用户列表
import networkUtil, {ResponseData} from "@/utils/networkUtil";
import {NetworkRoleUser, QueryUserListParams, NetworkRole} from "@/api/role";
import userList from "@/common/mock/system/user/user.json";
import authUser from "@/common/mock/system/role/authUser.json";
import roles from "@/common/mock/system/user/roles.json";
import deepClone from "@/utils/deepCloneUtil";


export function networkGetUserList(query: QueryUserListParams): Promise<ResponseData<NetworkRoleUser[]>> {
  return new Promise((resolve) => {
    // @ts-ignore
    const data = authUser as ResponseData<NetworkRoleUser[]>;
    resolve(deepClone(data));
  });
  return networkUtil({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

export interface NetworkUserAndRoles {
  code: number;
  msg: string;
  roles: NetworkRole[],
  user: NetworkRoleUser
}


// 查询该用户详细的角色分配列表
export function networkGetRoleListInAddUser(userId?: string): Promise<NetworkUserAndRoles> {
  const urlUserId = userId || "";

  return new Promise((resolve) => {
    // @ts-ignore
    const data = roles as NetworkUserAndRoles;
    resolve(deepClone(data));
  });

  return networkUtil({
    url: `system/user/authRole/${urlUserId}`,
    method: 'get'
  })
}