<template>
  <div
    id="form"
    class="container py-2 px-0 col-10 py-md-3 px-md-5 col-md-8 form"
  >
    <img
      src="@/assets/logo.svg"
      alt="Logo Groupomania"
      class="mt-2 mb-5 mt-md-3 mb-md-5"
    />
    <form @submit.prevent="login" class="col-10">
      <div class="row">
        <div class="mb-3 col-12">
          <label for="email" class="form-label"
            ><span v-if="!emailIsEmpty" class="form-alert" @click="emailAlert">
              ⚠️ </span
            ><span v-else> ✅ </span>Email</label
          >
          <input
            type="text"
            class="form-control"
            id="email"
            autocomplete="email"
            v-model="user.email"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label"
            ><span
              v-if="!passwordIsEmpty"
              class="form-alert"
              @click="passwordAlert"
            >
              ⚠️ </span
            ><span v-else> ✅ </span>Mot de passe</label
          >
          <input
            type="password"
            class="form-control"
            id="password"
            autocomplete="current-password"
            v-model="user.password"
          />
        </div>
        <div class="my-3 d-grid">
          <button
            type="submit"
            class="btn btn-primary mt-3 p-1"
            :disabled="!formIsValid"
          >
            Se connecter
          </button>
        </div>
      </div>
    </form>
    <div class="row mt-3">
      <p class="text-light text-center">
        Pas encore de compte ? <br />
        <router-link to="/signup" class="link">Inscrivez-vous</router-link>
      </p>
    </div>
    <BlockAlert
      :reveal-alert="revealAlert"
      :toggle-alert="toggleAlert"
      :message-alert="messageAlert"
    />
  </div>
</template>

<script>
import BlockAlert from "@/components/BlockAlert.vue";

import { AuthService } from "@/services";

export default {
  name: "login-form",
  components: {
    BlockAlert,
  },
  data() {
    return {
      user: {
        email: null,
        password: null,
      },
      revealAlert: false,
      messageAlert: "",
    };
  },
  computed: {
    emailIsEmpty() {
      return this.user.email;
    },
    passwordIsEmpty() {
      return this.user.password;
    },
    formIsValid() {
      return this.emailIsEmpty && this.passwordIsEmpty;
    },
  },
  methods: {
    async login() {
      try {
        const credentials = {
          email: this.user.email,
          password: this.user.password,
        };
        let res = await AuthService.login(credentials);
        await AuthService.saveToken(res.data.access_token);
        console.log(localStorage.getItem("token"));
        this.$router.push("/home");
      } catch (err) {
        console.log(err);
        this.messageAlert = err.response.data.error.errorMessage;
        this.revealAlert = !this.revealAlert;
      }
    },
    toggleAlert() {
      this.revealAlert = !this.revealAlert;
    },
    emailAlert() {
      this.messageAlert = "Veuillez saisir votre adresse mail";
      this.revealAlert = !this.revealAlert;
    },
    passwordAlert() {
      this.messageAlert = "Veuillez saisir votre mot de passe";
      this.revealAlert = !this.revealAlert;
    },
  },
};
</script>

<style scoped lang="scss">
#form {
  background-color: rgba($color-primary, 0.55);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  & img {
    height: 40px;
    width: auto;
  }
}
.form {
  &-label {
    color: $white;
    font-size: 16px;
    font-weight: 400;
    text-align: left;
  }
  &-control {
    border: none;
    padding: 12px;
    &:focus {
      box-shadow: 0px 0px 0px 4px rgba($color-primary, 0.5);
      outline: none;
    }
  }
  &-alert {
    cursor: pointer;
  }
}
.btn-primary {
  background: $color-tertiary;
  font-weight: 700;
  font-size: 24px;
  border-radius: 8px;
  border: none;
  &:hover {
    background: darken($color-tertiary, 5%);
  }
  &:focus {
    background: darken($color-tertiary, 5%);
    box-shadow: 0px 0px 0px 4px rgba($white, 0.5);
    outline: none;
  }
  &:disabled {
    background: $dark-gray;
    box-shadow: 0px 0px 0px 4px rgba($color-tertiary, 0.5);
    outline: none;
  }
}
.link {
  color: $color-tertiary;
  font-weight: 600;
  font-size: 20px;
  &:hover {
    color: darken($color-tertiary, 5%);
  }
}
</style>
