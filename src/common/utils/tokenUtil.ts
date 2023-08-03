import Cookies from "js-cookie";

const TokenKey = "Admin-Token";

export function getToken() {
  // return Cookies.get(TokenKey);
  return getTempStorage(TokenKey);
}

export function setToken(token: string) {
  if(!token) {
    console.error("setToken()然后token为空？？？？");
  }
  console.warn("setToken", token);
  // return Cookies.set(TokenKey, token);
  return setTempStorage(TokenKey, token);
}

export function removeToken() {
  console.warn("removeToken");
  // return Cookies.remove(TokenKey);
  setTempStorage(TokenKey, "");
}

export function setTempStorage(key: string ,value: string) {
  localStorage.setItem(key, value);
}

export function getTempStorage(key: string) {
  return localStorage.getItem(key);
}
