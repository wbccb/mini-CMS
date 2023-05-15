import {ResponseData} from "@/utils/networkUtil";
import systemRoleList from "@/common/mock/system/role/list.json";
import deepClone from "@/utils/deepCloneUtil";

export interface NetworkRole {
  "createBy": string;
  "createTime": string;
  "updateBy": string;
  "updateTime": string;
  "remark": string;
  "roleId": number;
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