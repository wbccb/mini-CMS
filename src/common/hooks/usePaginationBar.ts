import {nextTick, ref} from "vue";
import {ResponseData} from "@/common/utils/networkUtil";

/**
 * 通用版本，传入一个获取List的方法，获取对应的T[]数据
 * @param getListData
 */
export const usePaginationBar = <T>(
  getListData: (pageNo: number, pageSize: number) => Promise<ResponseData<T[]>>
) => {
  const currentPage = ref<number>(1);
  const pageSize = ref<number>(10);
  const total = ref<number>(0);
  const dataList = ref<T[]>();
  const loading = ref<boolean>(false);

  const handleSizeChange = async (val: number) => {
    currentPage.value = 1;
    pageSize.value = val;

    await forceRefresh();
  };
  const handleCurrentChange = async (val: number) => {
    currentPage.value = val;

    await forceRefresh();
  };

  const forceRefresh = async () => {
    loading.value = true;
    const responseData = await getListData(currentPage.value, pageSize.value);
    // TODO 要适配不同数据结构
    dataList.value = responseData.data || responseData.rows || responseData.roles;

    if (responseData.total) {
      total.value = responseData.total;
    }
    await nextTick(() => {
      loading.value = false;
    });
  };

  const indexMethod = (index: number) => {
    return index + (currentPage.value - 1) * pageSize.value + 1;
  };

  return {
    dataList,
    currentPage,
    pageSize,
    total,
    loading,
    indexMethod,
    handleSizeChange,
    handleCurrentChange,
    forceRefresh,
  };
};
