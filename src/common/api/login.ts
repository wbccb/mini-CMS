import networkUtil, {ResponseData} from "../utils/networkUtil";

/**
 * 都加上固定前缀network，可以快速辨别出是api/xxx.ts的请求
 */

// 获取验证码
export function networkGetCodeImg() {
  return networkUtil({
    url: "/captchaImage",
    headers: {
      isToken: false,
    },
    method: "get",
    timeout: 20 * 1000,
  });
}

export interface NetworkRole {
  "roleId": number;
  "roleName": string;
  "roleKey": string;
  "roleSort": number
  "dataScope": string;
}
export interface NetworkLogin {
  permissions: string[];
  roles: string[];
  user: {roles: NetworkRole[]};
  roleId: null | string;
  admin: boolean;
}
export interface NetworkLoginResponse {
  permissions: string[];
  roles: string[];
  user: {
    roles: NetworkRole[];
    avatar: string;
    userName: string;
  };
  roleId: null | string;
  admin: boolean;

  msg: string;
  code: number;

  [key: string]: any;
}


export function networkLogin(
  userName: string,
  password: string,
  code: string,
  uuid: string
): Promise<any> {
  const data = {
    username: userName,
    password,
    code,
    uuid,
  };

  return networkUtil({
    url: "/login",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
}

// 获取用户详细信息
export function networkGetInfo(): Promise<NetworkLoginResponse> {

  return new Promise((resolve)=> {
    // @ts-ignore
    const mockResponseData = {"msg":"操作成功","code":200, "permissions":["*:*:*"], "roles":["admin"], "user":{"createBy":"admin","createTime":"2023-04-23 16:11:38","updateBy":null,"updateTime":null,"remark":"管理员","userId":1,"deptId":103,"userName":"admin","nickName":"wbccb","email":"wbccb@163.com","phonenumber":"15888888888","sex":"1","avatar":"","password":"$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2","status":"0","delFlag":"0","loginIp":"218.77.45.139","loginDate":"2023-05-11T21:21:58.000+08:00","dept":{"createBy":null,"createTime":null,"updateBy":null,"updateTime":null,"remark":null,"deptId":103,"parentId":101,"ancestors":"0,100,101","deptName":"研发部门","orderNum":1,"leader":"wbccb","phone":null,"email":null,"status":"0","delFlag":null,"parentName":null,"children":[]},"roles":[{"createBy":null,"createTime":null,"updateBy":null,"updateTime":null,"remark":null,"roleId":1,"roleName":"超级管理员","roleKey":"admin","roleSort":1,"dataScope":"1","menuCheckStrictly":false,"deptCheckStrictly":false,"status":"0","delFlag":null,"flag":false,"menuIds":null,"deptIds":null,"permissions":null,"admin":true}],"roleIds":null,"postIds":null,"roleId":null,"admin":true}} as NetworkLoginResponse;
    resolve(mockResponseData);
  });

  // return networkUtil({
  //   url: "/getInfo",
  //   method: "get",
  // });
}

export const errorCodeText: Record<string, string> = {
  "401": "认证失败，无法访问系统资源",
  "403": "当前操作没有权限",
  "404": "访问资源不存在",
  default: "系统未知错误，请反馈给管理员",
};

// 退出登录
export function logout() {
  return networkUtil({
    url: "/logout",
    method: "post",
  });
}
