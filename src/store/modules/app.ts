import {defineStore} from "pinia";
import Cookies from "js-cookie";
import {sidebarStatusCookieKey} from "@/utils/CONST";

interface AppStore {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    hide: boolean;
  };
  device: string;
  size: string;
}

const useAppStore = defineStore({
  id: "app",
  state: (): AppStore => {
    return {
      sidebar: {
        opened: !!Cookies.get(sidebarStatusCookieKey),
        withoutAnimation: false,
        hide: false,
      },
      device: "desktop",
      size: Cookies.get("size") || "default",
    };
  },
  actions: {
    toggleSideBar(withoutAnimation: boolean) {
      if (this.sidebar.hide) {
        // 隐藏情况下不能切换侧边栏
        return false;
      }
      this.sidebar.opened = !this.sidebar.opened;
      this.sidebar.withoutAnimation = withoutAnimation;

      if (this.sidebar.opened) {
        Cookies.set(sidebarStatusCookieKey, "true");
      } else {
        Cookies.set(sidebarStatusCookieKey, "");
      }
    },
    openSider() {},
  },
});

export default useAppStore;
