// 查询用户列表
import networkUtil, {ResponseData} from "@/utils/networkUtil";
import {NetworkRoleUser, QueryUserListParams} from "@/api/role";
import userList from "@/common/mock/system/user/user.json";
import authUser from "@/common/mock/system/role/authUser.json";
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
