import {nextTick, onMounted, ref, Ref, watch, watchEffect} from "vue";

export const useDebounce = (valueData: Ref<string>) => {
  const debounceValue = ref<string>(valueData.value);
  const isRendering = ref(true);

  let watcher: any = null;
  const clearWatcher = () => {
    if (watcher) {
      clearTimeout(watcher);
      watcher = null;
    }
  };

  watch(
    () => valueData.value,
    (newValue) => {
      clearWatcher();
      isRendering.value = true;
      watcher = setTimeout(() => {
        debounceValue.value = valueData.value;
        isRendering.value = false;
      }, 5000);
    }
  );

  const forceRefreshValue = async () => {
    await nextTick();
    // watcher都会在nextTick之后执行完成
    clearWatcher();

    debounceValue.value = valueData.value;
    isRendering.value = false;
  };

  return {
    debounceValue,
    forceRefreshValue,
    isRendering,
  };
};
