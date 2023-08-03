import {defineStore} from "pinia";
import {getToken, removeToken, setTempStorage, setToken} from "@/common/utils/tokenUtil";
import {
  logout,
  networkGetInfo,
  networkLogin,
  networkRegister,
  NetworkRole,
} from "@/common/api/login";
import defaultAvatar from "@/common/assets/profile.jpg";

interface UserStore {
  token: string | null;
  name: string;
  avatar: string;
  roles: NetworkRole[] | ["ROLE_DEFAULT"];
  permissions: string[];
  userId: string;
}

interface LoginData {
  username: string;
  password: string;
  code: string;
  uuid: string;
}

interface RegisterData {
  nickName: string;
  password1: string;
  password2: string;
  nickName: string;
}

// state 是 store 的数据 (data)，getters 是 store 的计算属性 (computed)，而 actions 则是方法 (methods)
const useUserStore = defineStore({
  id: "user",
  state: (): UserStore => ({
    token: getToken(),
    name: "",
    avatar: "",
    roles: [],
    permissions: [],
    userId: ""
  }),
  actions: {
    async storeRegister(userInfo: RegisterData) {
      const {nickName, password1, password2, email} = userInfo;
      // TODO 需要处理await失败的情况
      try {
        const res = await networkRegister(email, password1, password2, nickName);
        return true;
      } catch (e) {
        console.error("注册失败", e);
        return Promise.reject(e);
      }
    },
    async storeLogin(userInfo: LoginData) {
      // 进行网络请求的登录，然后存入token
      const {username, password, code, uuid} = userInfo;

      // TODO 需要处理await失败的情况
      try {
        // TODO 登录获取token
        const res = await networkLogin(username, password, code, uuid);
        const {userId, token} = res.data;
        setToken(token);
        setTempStorage("userId", userId);
        this.token = token;
        this.userId = userId;
      } catch (e) {
        return Promise.reject("登录失败");
      }

      return true;
    },
    async storeGetInfo() {
      try {
        // 如果上面的userInfo获取成功，说明存在本地的token没有过期，可以直接使用，更新对应的store
        const localStoreToken =  getToken();
        this.token = localStoreToken;

        // TODO token直接获取对应的userInfo
        const res = await networkGetInfo(localStoreToken);
        const {avatar, roles, userName} = res.user;
        const userAvatar = !avatar ? defaultAvatar : import.meta.env.VITE_BASE_URL + avatar;



        if (Array.isArray(roles) && roles.length > 0) {
          this.roles = roles;
          this.permissions = res.permissions;
        } else {
          this.roles = ["ROLE_DEFAULT"];
        }
        this.name = userName;
        this.avatar = userAvatar;

        return res;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async storeLogout() {
      try {
        const res = await logout();
        this.token = "";
        this.roles = [];
        this.permissions = [];
        removeToken();
        return true;
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
});

export default useUserStore;
