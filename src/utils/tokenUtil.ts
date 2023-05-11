import Cookies from "js-cookie";

const TokenKey = "Admin-Token";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  console.warn("setToken");
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  console.warn("removeToken");
  return Cookies.remove(TokenKey);
}
