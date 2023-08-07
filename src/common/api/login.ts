import networkUtil, {ResponseData} from "../utils/networkUtil";
import {ResponseUser, UserStore} from "@/store/modules/user";


export interface UserInfo {
    // 返回的个人信息
    user: ResponseUser
}

export type ResponseUserInfo = ResponseData<UserInfo>;


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

export function networkLogin(
    userName: string,
    password: string,
    code: string,
    uuid: string
): Promise<ResponseData<UserStore>> {
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
export function networkGetInfo(): Promise<ResponseUserInfo> {
    return networkUtil({
        url: prefix + "/info",
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
    password2: string
): Promise<any> {
    const data = {
        email,
        password1,
        password2
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
