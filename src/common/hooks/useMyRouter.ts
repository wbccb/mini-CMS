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

  const goToRoleIndex = (replace = false) => {
    if (replace) {
      return router.replace({name: "Role"});
    } else {
      return router.push({name: "Role"});
    }
  };

  const goToMenuIndex = (replace = false) => {
    if (replace) {
      return router.replace({name: "Menu"});
    } else {
      return router.push({name: "Menu"});
    }
  };

  const goToUserIndex = (replace = false) => {
    if (replace) {
      return router.replace({name: "User"});
    } else {
      return router.push({name: "User"});
    }
  };

  return {
    goToRegister,
    goToLogin,
    goToMenuIndex,
    goToRoleIndex,
    goToUserIndex
  };
};

export {useMyRouter};
