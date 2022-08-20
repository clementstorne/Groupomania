<template>
  <div class="login d-flex justify-content-center align-items-center">
    <FormSignup />
  </div>
</template>

<script>
import FormSignup from "@/components/FormSignup.vue";

export default {
  name: "SignupView",
  components: {
    FormSignup,
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
