<template>
  <div class="login-wrapper">
    <!--中间内容-->
    <div class="login-content">
      <el-form class="login-form" ref="loginRef" :model="loginForm" :rules="loginRules">
        <h3 class="title">CMS-VUE登录页面</h3>
        <el-form-item prop="username">
          <el-input
              v-model="loginForm.username"
              type="text"
              size="large"
              auto-complete="off"
              placeholder="账号"
          >
            <template #prefix>
              <svg-icon icon-class="user" class="el-input__icon input-icon"></svg-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              size="large"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter="handleLogin"
          >
            <template #prefix>
              <svg-icon icon-class="password" class="el-input__icon input-icon"></svg-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="code" v-if="captchaEnabled">
          <el-input
              v-model="loginForm.code"
              size="large"
              auto-complete="off"
              placeholder="验证码"
              @keyup.enter="handleLogin"
          >
            <template #prefix>
              <svg-icon icon-class="validCode" class="el-input__icon input-icon"></svg-icon>
            </template>
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img"/>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button size="large" type="primary" :loading="loading" @click.preven="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button size="large" type="info" @click.preven="navigateToRegister">
            <span>切换到注册页面</span>
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
import {useMyRouter} from "@/common/hooks/useMyRouter";

type IElForm = InstanceType<typeof ElForm>;

export default defineComponent({
  name: "login",
  components: {SvgIcon},
  props: {},
  setup() {
    const loginForm = reactive({
      username: "18814122731@163.com",
      password: "admin123",
      rememberMe: false,
      code: "",
      uuid: "", // 配套code一起使用
    });

    const loading = ref(false);

    // 验证码开关
    const captchaEnabled = ref(false);
    const codeUrl = ref("");
    const getCode = async () => {
      const res = await networkGetCodeImg();
      captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
      if (captchaEnabled.value) {
        codeUrl.value = "data:image/gif;base64," + res.img;
        loginForm.uuid = res.uuid;
      }
    };

    const userStore = useUserStore();
    const loginRef = ref<IElForm>();
    const router = useRouter();
    const redirect = ref<string>(""); // 如果是某一个业务页面跳转过来，则有redirect
    const loginRules = {
      username: [{required: true, trigger: "blur", message: "请输入您的账号"}],
      password: [{required: true, trigger: "blur", message: "请输入您的密码"}],
      code: [{required: false, trigger: "change", message: "请输入验证码"}],
    };
    const handleLogin = () => {
      if (!loginRef.value) {
        return;
      }
      const elementForm = loginRef.value!;
      elementForm.validate((valid) => {
        if (valid) {
          loading.value = true;
          // 记住密码：将账号、密码和记住我存入到cookies中
          if (loginForm.rememberMe) {
            Cookies.set("username", loginForm.username, {expires: 30});
            Cookies.set("password", loginForm.password, {expires: 30});
            Cookies.set("rememberMe", loginForm.rememberMe.toString(), {expires: 30});
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }

          // 进行登录
          userStore
              .storeLogin(loginForm)
              .then((res) => {
                ElMessage({
                  type: "success",
                  message: "登录成功",
                });
                const path: string = redirect.value || "/";
                router.push({path: path});
              })
              .catch((error) => {
                // 错误已经在store中进行处理
              })
              .finally(() => {
                loading.value = false;
              });
        }
      });
    };


    const {goToRegister} = useMyRouter();
    const navigateToRegister = () => {
      goToRegister(true);
    }

    onMounted(() => {
      // TODO 暂时屏蔽验证码
      // getCode();
    });

    return {
      loginForm,
      handleLogin,
      navigateToRegister,
      loading,
      getCode,
      codeUrl,
      captchaEnabled,
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
