<template>
  <div class="login-wrapper">
    <!--中间内容-->
    <div class="login-content">
      <el-form class="login-form" ref="loginRef" :model="dataForm" :rules="loginRules">
        <h3 class="title">CMS-VUE注册页面</h3>
        <el-form-item prop="username">
          <el-input
              v-model="dataForm.email"
              type="text"
              size="large"
              auto-complete="off"
              placeholder="邮箱"
          >
            <template #prefix>
              <svg-icon icon-class="user" class="el-input__icon input-icon"></svg-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="dataForm.password1"
              type="password"
              size="large"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter="handleBtnClick"
          >
            <template #prefix>
              <svg-icon icon-class="password" class="el-input__icon input-icon"></svg-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="dataForm.password2"
              type="password"
              size="large"
              auto-complete="off"
              placeholder="重复密码"
              @keyup.enter="handleBtnClick"
          >
            <template #prefix>
              <svg-icon icon-class="password" class="el-input__icon input-icon"></svg-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="nickName">
          <el-input
              v-model="dataForm.password2"
              type="text"
              size="large"
              auto-complete="off"
              placeholder="昵称"
              @keyup.enter="handleBtnClick"
          >
            <template #prefix>
              <svg-icon icon-class="password" class="el-input__icon input-icon"></svg-icon>
            </template>
          </el-input>
        </el-form-item>


        <el-form-item>
          <el-button size="large" type="primary" :loading="loading" @click.preven="handleBtnClick">
            <span v-if="!loading">注 册</span>
            <span v-else>注 册 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";
import SvgIcon from "@/components/svg-icon/svg-icon.vue";
import {networkGetCodeImg, networkLogin} from "@/common/api/login";
import ElForm from "element-plus";
import Cookies from "js-cookie";
import useUserStore from "@/store/modules/user";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

type IElForm = InstanceType<typeof ElForm>;

export default defineComponent({
  name: "register",
  components: {SvgIcon},
  props: {},
  setup() {
    const dataForm = reactive({
      email: "18814122731@163.com",
      password1: "admin123",
      password2: "admin123",
      nickName: "unknown"
    });

    const loading = ref(false);

    const userStore = useUserStore();
    const loginRef = ref<IElForm>();
    const router = useRouter();
    const redirect = ref<string>(""); // 如果是某一个业务页面跳转过来，则有redirect
    const loginRules = {
      nickName: [{required: true, trigger: "blur", message: "请输入您的账号"}],
      password1: [{required: true, trigger: "blur", message: "请输入您的密码"}],
      password2: [{required: true, trigger: "blur", message: "请输入您的密码"}],
    };
    const handleBtnClick = () => {
      if (!loginRef.value) {
        return;
      }
      const elementForm = loginRef.value!;
      elementForm.validate((valid) => {
        if (valid) {
          loading.value = true;

          // 进行登录
          userStore
              .storeRegister(dataForm)
              .then((res) => {
                debugger;
                ElMessage({
                  type: "success",
                  message: "注册成功",
                });
                const path: string = redirect.value || "/";
                router.push({path: path});
                console.warn("storeRegister success", res);
              })
              .catch((error) => {
                console.info("storeRegister error", error);
                // 错误已经在store中进行处理
                if (error) {
                  const message = error.data || error;
                  ElMessage({
                    type: "error",
                    message: "注册失败:" + JSON.stringify(message)
                  });
                } else {
                  ElMessage({
                    type: "error",
                    message: "注册失败:原因未知"
                  });
                }
              })
              .finally(() => {
                loading.value = false;
              });
        }
      });
    };

    return {
      dataForm,
      handleBtnClick,
      loading,
      loginRef,
      loginRules,
    };
  },
});
</script>

<style lang="scss">
.login-wrapper {
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;

  background-color: #eee;

  display: flex;
  align-items: center;
  justify-content: center;
}

.login-content {
  width: 500px;
  border-radius: 3px;
  background-color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  box-sizing: border-box;

  .title {
    width: 100%;
    text-align: center;
  }

  .el-form-item {
    margin-bottom: 22px;

    .el-form-item__content {
      width: 100%;
      display: flex;
      flex-direction: row;

      .el-input {
        line-height: 38px;
        height: 38px;
        flex: 1;

        .el-input__wrapper {
          position: relative;
          width: 100%;
          height: 38px;
          line-height: 38px;
          box-sizing: border-box;
          overflow: hidden;

          display: flex;
          flex-direction: row;

          .el-input__prefix {
            position: absolute;
            left: 5px;
            top: 50%;
            transform: translateY(-50%);

            width: 16px;
            line-height: 38px;
            height: 38px;
          }

          .el-input__inner {
            display: block;
            line-height: 38px;
            height: 38px;
            box-sizing: border-box;
            padding-left: 30px;

            flex: 1;
          }
        }
      }

      .login-code {
        line-height: 38px;
        height: 38px;
        box-sizing: border-box;
        overflow: hidden;

        .login-code-img {
          height: 38px;
          padding-left: 12px;
        }
      }

      button {
        width: 100%;
      }
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
</style>
