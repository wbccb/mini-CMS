import axios, {CreateAxiosDefaults} from "axios";
import {ElMessage, ElNotification} from "element-plus";
import {errorCodeText} from "@/common/api/login";
import {getToken} from "@/common/utils/tokenUtil";
import {tansParams} from "@/common/utils/ruoyi_test";
import useUserStore from "@/store/modules/user";
import router from "@/router";

export interface ResponseData<T> {
  code: number;
  msg: string;
  data: T;
  rows?: T;
  roles?: T;
  total?: number;
}

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

const options: CreateAxiosDefaults = {
  // 请求URL的host+baseURL(公共前缀)，为了减少请求写重复的公共前缀
  baseURL: import.meta.env.VITE_BASE_URL,
  // 超时
  timeout: 10 * 1000,
} as CreateAxiosDefaults;

const server = axios.create(options);

// 需要将登录成功后拿到的token放入到请求中，保证会话正常
server.interceptors.request.use((config) => {
  const isToken = (config.headers || {}).isToken === "false";

  if (getToken() && !isToken) {
    config.headers["Authorization"] = `Bearer ${getToken()}`;
  }

  switch (config.method) {
    case "get":
      if (config.params) {
        let url = config.url + "?" + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
      }
      break;
    case "post":
    case "put":
      // TODO 检测短时间内是否重复提交请求
      // ruoyi使用的是会话级缓存，比对url、data是否一致，然后使用time进行时间的比对
      break;
  }

  return config;
});

server.interceptors.response.use(
  (res) => {
    // 由于返回的数据层级较多，因此解析出res数据，拼接为简单的数据结构返回
    const code: number = res.data.code || 200;
    const msg = errorCodeText[code] || res.data.msg || errorCodeText["default"];

    if (res.request.responseType === "blob" || res.request.responseType === "arraybuffer") {
      return res.data;
    }

    if (code !== 200) {
      // 具体的业务代码应该在各自的.vue组件中进行，比如Login.vue弹出登录成功的提示
      // 这里的提示只是一种普遍性的检测code
      switch (code) {
        case 401:
          console.error("返回401，会话过期，需要重新登录");
          // 登录过期提示
          ElMessage({message: msg, type: "error"});
          const userStore = useUserStore();
          userStore.storeLogout().then(() => {
            router.push("/login");
          });
          return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
        case 500:
          ElMessage({message: msg, type: "error", duration: 20 * 1000});
          return Promise.reject(new Error(msg));
        case 601:
          ElMessage({message: msg, type: "warning"});
          return Promise.reject(new Error(msg));
        default:
          ElNotification.error({title: msg});
          return Promise.reject("error");
      }
      return Promise.reject("error");
    }

    return Promise.resolve(res.data);
  },
  (error) => {
    let {message} = error;
    ElMessage({message, type: "error", duration: 5 * 1000});
    return Promise.reject(error);
  }
);

export default server;
