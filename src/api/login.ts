import networkUtil from "../utils/networkUtil";

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

export function networkLogin(userName, password, code, uuid) {
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
export function networkGetInfo() {
  return networkUtil({
    url: "/getInfo",
    method: "get",
  });
}

export const errorCodeText = {
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
