import {createApp} from "vue";
import "./common/styles/index.scss";
import App from "./App.vue";
import store from "./store";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/es/components/message/style/css";

import locale from "element-plus/lib/locale/lang/zh-cn";
import elementIconComponents from "./components/svg-icon/svgicon";
import SvgIcon from "./components/svg-icon/svg-icon.vue";

import "./router/initDynamicRoute";

const app = createApp(App);

// 全局组件挂在
// TODO 需要处理全局的svg-icon和el-svg的管理问题
app.component("svg-icon", SvgIcon);

app.use(store);
app.use(router);
app.use<Array<Record<string, any>>>(ElementPlus, {locale});
app.use(elementIconComponents);

app.mount("#app");
