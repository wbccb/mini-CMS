import {defineStore} from "pinia";
import {getToken, removeToken, setToken} from "@/common/utils/tokenUtil";
import {logout, networkGetInfo, networkLogin, NetworkRole} from "@/common/api/login";
import defaultAvatar from "@/common/assets/profile.jpg";

interface UserStore {
  token: string | undefined;
  name: string;
  avatar: string;
  roles: NetworkRole[] | ["ROLE_DEFAULT"];
  permissions: string[];
}

interface LoginData {
  username: string;
  password: string;
  code: string;
  uuid: string;
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
  }),
  actions: {
    async storeLogin(userInfo: LoginData) {
      // 进行网络请求的登录，然后存入token
      const {username, password, code, uuid} = userInfo;

      // TODO 需要处理await失败的情况
      try {
        const res = await networkLogin(username, password, code, uuid);
        setToken(res.token);
        this.token = res.token;
      } catch (e) {
        return e;
      }

      return true;
    },
    async storeGetInfo() {
      try {
        const res = await networkGetInfo();
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
      const res = await logout();
      this.token = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      return true;
    },
  },
});

export default useUserStore;
