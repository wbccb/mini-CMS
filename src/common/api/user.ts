// 查询用户列表
import networkUtil, {ResponseData} from "@/common/utils/networkUtil";
import {NetworkUser, QueryUserListParams, NetworkRole} from "@/common/api/system/role";
import userList from "@/common/mock/system/user/user.json";
import authUser from "@/common/mock/system/role/authUser.json";
import roles from "@/common/mock/system/user/roles.json";
import deepClone from "@/common/utils/deepCloneUtil";


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
    method: "get",
  });
}
