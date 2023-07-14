import {Ref} from "vue";
import type {FormInstance, FormRules} from "element-plus";
import {ElMessage} from "element-plus";
export const useSubmitForm = (formRef: Ref<FormInstance | undefined>) => {
  const checkRulesAndSubmit = async (fn: Function) => {
    if (!formRef.value) {
      ElMessage.error("组件form为空");
      return;
    }
    const elementForm = formRef.value!;
    const res = await elementForm.validate();
    if (!res) {
      return;
    }
    fn();
  };

  return {
    checkRulesAndSubmit,
  };
};
