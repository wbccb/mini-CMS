import {createApp} from "vue";
import "./styles/index.scss";
import App from "./App.vue";
import store from "./store";
import router from "./router";

import ElementPlus from "element-plus";
import locale from "element-plus/lib/locale/lang/zh-cn";

const app = createApp(App);

app.use(store);
app.use(router);
app.use<Array<Record<string, any>>>(ElementPlus, {locale});

app.mount("#app");
