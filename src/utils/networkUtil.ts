import axios, {CreateAxiosDefaults} from "axios";
import {ElMessage} from "element-plus";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

const options: CreateAxiosDefaults = {
  // 请求URL的host+baseURL(公共前缀)，为了减少请求写重复的公共前缀
  baseURL: import.meta.env.VITE_BASE_URL,
  // 超时
  timeout: 10 * 1000,
} as CreateAxiosDefaults;

const server = axios.create(options);

server.interceptors.response.use(
  (res) => {
    // 由于返回的数据层级较多，因此解析出res数据，拼接为简单的数据结构返回
    const code = res.data.code || 200;

    if (res.request.responseType === "blob" || res.request.responseType === "arraybuffer") {
      return res.data;
    }

    if (code !== 200) {
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
