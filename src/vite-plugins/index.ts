import vue from "@vitejs/plugin-vue";
import createElementAutoImport from "./auto-import";

export default function createVitePlugins(viteEnv: any, isBuild = false) {
  const vitePlugins = [vue()];

  const elementAutoImport = createElementAutoImport();
  if (Array.isArray(elementAutoImport)) {
    vitePlugins.push(...elementAutoImport);
  } else {
    vitePlugins.push(elementAutoImport);
  }
  return vitePlugins;
}
