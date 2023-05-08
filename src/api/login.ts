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
