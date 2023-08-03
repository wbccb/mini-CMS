import networkUtil, {ResponseData} from "../utils/networkUtil";

/**
 * 都加上固定前缀network，可以快速辨别出是api/xxx.ts的请求
 */
const prefix = "/user";

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
    email: userName,
    password,
    code,
    uuid,
    type: 101,
  };

  return networkUtil({
    url: prefix + "/login",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
}

// 获取用户详细信息
export function networkGetInfo(token): Promise<NetworkLoginResponse> {
  return new Promise((resolve) => {
    // @ts-ignore
    const mockResponseData = {
      msg: "操作成功",
      code: 200,
      permissions: ["*:*:*"],
      roles: ["admin"],
      user: {
        createBy: "admin",
        createTime: "2023-04-23 16:11:38",
        updateBy: null,
        updateTime: null,
        remark: "管理员",
        userId: 1,
        deptId: 103,
        userName: "admin",
        nickName: "wbccb",
        email: "wbccb@163.com",
        phonenumber: "15888888888",
        sex: "1",
        avatar: "",
        password: "$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2",
        status: "0",
        delFlag: "0",
        loginIp: "218.77.45.139",
        loginDate: "2023-05-11T21:21:58.000+08:00",
        dept: {
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: 103,
          parentId: 101,
          ancestors: "0,100,101",
          deptName: "研发部门",
          orderNum: 1,
          leader: "wbccb",
          phone: null,
          email: null,
          status: "0",
          delFlag: null,
          parentName: null,
          children: [],
        },
        roles: [
          {
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            roleId: 1,
            roleName: "超级管理员",
            roleKey: "admin",
            roleSort: 1,
            dataScope: "1",
            menuCheckStrictly: false,
            deptCheckStrictly: false,
            status: "0",
            delFlag: null,
            flag: false,
            menuIds: null,
            deptIds: null,
            permissions: null,
            admin: true,
          },
        ],
        roleIds: null,
        postIds: null,
        roleId: null,
        admin: true,
      },
    } as NetworkLoginResponse;
    resolve(mockResponseData);
  });

  return networkUtil({
    url: prefix +"/getInfo",
    method: "get",
  });
}

export const errorCodeText: Record<string, string> = {
  "10001": "用户不存在",
  "10002": "账号/密码错误",
  "10003": "登录超时",
  "10011": "注册失败",
  "10021": "参数规则不符合设定",
};

// 退出登录
export function logout() {
  return networkUtil({
    url: prefix + "/logout",
    method: "post",
  });
}

// 注册
export function networkRegister(
  email: string,
  password1: string,
  password2: string,
  nickName: string
): Promise<any> {
  const data = {
    email,
    password1,
    password2,
    nickName,
  };

  return networkUtil({
    url: prefix + "/register",
    headers: {
      isToken: false,
      "content-type": "application/json",
    },
    method: "post",
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
