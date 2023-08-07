import {defineStore} from "pinia";
import {getToken, removeToken, setTempStorage, setToken} from "@/common/utils/tokenUtil";
import {
    logout,
    networkGetInfo,
    networkLogin,
    networkRegister
} from "@/common/api/login";
import defaultAvatar from "@/common/assets/profile.jpg";
import {RoleType} from "@/common/utils/CONST";


export interface UserStore {
    token: string | null;
    user: ResponseUser | null;
}

// 数据库返回的User的实体类
export interface ResponseUser {
    id: string;
    name: string;
    avatar: string;
    roleId: typeof RoleType;
    permissions: string[];
    userId: string;
}

interface RequestLogin {
    username: string;
    password: string;
    code: string;
    uuid: string;
}

interface RequestRegister {
    email: string;
    password1: string;
    password2: string;
}

// state 是 store 的数据 (data)，getters 是 store 的计算属性 (computed)，而 actions 则是方法 (methods)
const useUserStore = defineStore({
    id: "user",
    state: (): UserStore => ({
        token: getToken(),
        user: null,
    }),
    actions: {
        async storeRegister(userInfo: RequestRegister) {
            const {password1, password2, email} = userInfo;
            // TODO 需要处理await失败的情况
            try {
                const res = await networkRegister(email, password1, password2);
                return true;
            } catch (e) {
                console.error("注册失败", e);
                return Promise.reject(e);
            }
        },
        async storeLogin(userInfo: RequestLogin) {
            // 进行网络请求的登录，然后存入token
            const {username, password, code, uuid} = userInfo;

            // TODO 需要处理await失败的情况
            try {
                // TODO 登录获取token
                const res = await networkLogin(username, password, code, uuid);
                const {user, token} = res.data;
                if (user) {
                    const userId = user.id;
                    setTempStorage("userId", userId);
                    this.user = user;
                }
                if (token) {
                    setToken(token);
                    this.token = token;
                }
            } catch (e) {
                return Promise.reject("登录失败");
            }

            return true;
        },
        async storeGetInfo() {
            try {
                // 如果上面的userInfo获取成功，说明存在本地的token没有过期，可以直接使用，更新对应的store
                const localStoreToken = getToken();
                this.token = localStoreToken;

                // TODO token直接获取对应的userInfo
                const res = await networkGetInfo();
                const {user} = res.data;

                this.user = user;

                return res;
            } catch (e) {
                return Promise.reject(e);
            }
        },
        async storeLogout() {
            try {
                const res = await logout();
                this.token = "";
                this.user = null;
                // this.roles = [];
                // this.permissions = [];
                removeToken();
                return true;
            } catch (e) {
                return Promise.reject(e);
            }
        },
    },
});

export default useUserStore;
