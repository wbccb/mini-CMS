<template>
  <div class="login-wrapper">
    <!--中间内容-->
    <div class="login-content">
      <el-form class="login-form">
        <h3 class="title">CMS-VUE</h3>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.userName"
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
            <img :src="codeUrl" @click="getCode" class="login-code-img" />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button size="large" type="primary" :loading="loading" @click.preven="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";
import {Edit} from "@element-plus/icons-vue";
import SvgIcon from "@/components/svg-icon/svg-icon.vue";
import {networkGetCodeImg} from "@/api/login";

export default defineComponent({
  name: "login",
  components: {SvgIcon},
  props: {},
  setup() {
    const loginForm = reactive({
      userName: "",
      password: "",
      rememberMe: false,
      code: "",
      uuid: "",
    });

    const loading = ref(false);

    // 验证码开关
    const captchaEnabled = ref(true);
    const codeUrl = ref("");
    const getCode = async () => {
      const res = await networkGetCodeImg();
      captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
      if (captchaEnabled.value) {
        codeUrl.value = "data:image/gif;base64," + res.img;
        loginForm.uuid = res.uuid;
      }
    };
    const handleLogin = () => {};

    onMounted(() => {
      getCode();
    });

    return {
      loginForm,
      handleLogin,
      loading,
      getCode,
      codeUrl,
      captchaEnabled,
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
