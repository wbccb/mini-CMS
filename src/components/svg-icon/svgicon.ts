import * as components from "@element-plus/icons-vue";

/**
 * 在main.ts中进行app.use(xxx)注册这些icon的components
 * 参考element-plus官方文档：https://element-plus.gitee.io/zh-CN/component/icon.html#%E5%AE%89%E8%A3%85
 */
export default {
  install: (app) => {
    for (const key in components) {
      const componentConfig = components[key];
      app.component(componentConfig.name, componentConfig);
      // console.info("已经注册icons-vue", componentConfig.name);
    }
  },
};
