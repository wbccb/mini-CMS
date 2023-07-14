import {useRouter} from "vue-router";

const useMyRouter = () => {
  const router = useRouter();

  const goToRegister = (replace = false) => {
    if (replace) {
      return router.replace({name: "Register"});
    } else {
      return router.push({name: "Register"});
    }
  };

  const goToLogin = (replace = false) => {
    if (replace) {
      return router.replace({name: "Login"});
    } else {
      return router.push({name: "Login"});
    }
  };

  return {
    goToRegister,
    goToLogin,
  };
};

export {useMyRouter};
