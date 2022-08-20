<template>
  <div class="login d-flex justify-content-center align-items-center">
    <FormLogin />
  </div>
</template>

<script>
import FormLogin from "@/components/FormLogin.vue";

export default {
  name: "LoginView",
  components: {
    FormLogin,
  },
};
</script>

<style scoped lang="scss">
.login {
  height: 100vh;
  background-color: $color-tertiary;
  background: url(@/assets/LoginPageBackground.jpg) center no-repeat;
  background-size: cover;
}
</style>
