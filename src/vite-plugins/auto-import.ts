import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";

// element-plus组件自动import
// 参考https://element-plus.gitee.io/en-US/guide/quickstart.html#on-demand-import
export default function createAutoImport() {
  return [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ];
}
