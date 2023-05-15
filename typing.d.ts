// typings.d.ts or router.ts
import 'vue-router'


// 参考https://router.vuejs.org/zh/guide/advanced/meta.html
declare module 'vue-router' {
    interface RouteMeta {
        title: string|undefined;
        breadcrumb: false;
        hidden: boolean;
    }
}
