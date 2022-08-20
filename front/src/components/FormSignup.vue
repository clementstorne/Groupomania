<template>
  <div
    id="form"
    class="container py-2 px-0 col-10 py-md-3 px-md-5 col-md-8 form"
  >
    <img
      src="@/assets/logo.svg"
      alt="Logo Groupomania"
      class="mt-2 mb-2 mt-md-3 mb-mt-5"
    />
    <form @submit.prevent="signup" class="col-10">
      <div class="row form-row">
        <div class="mb-2 mb-md-3">
          <label for="firstname" class="form-label"
            ><span
              v-if="!firstnameIsValid"
              class="form-alert"
              @click="firstnameAlert"
            >
              ⚠️ </span
            ><span v-else> ✅ </span>Prénom
          </label>
          <input
            type="text"
            class="form-control"
            id="firstname"
            autocomplete="given-name"
            v-model="user.firstname"
          />
        </div>
        <div class="mb-2 mb-md-3">
          <label for="lastname" class="form-label"
            ><span
              v-if="!lastnameIsValid"
              class="form-alert"
              @click="lastnameAlert"
            >
              ⚠️ </span
            ><span v-else> ✅ </span>Nom</label
          >
          <input
            type="text"
            class="form-control"
            id="lastname"
            autocomplete="family-name"
            v-model="user.lastname"
          />
        </div>
        <div class="mb-2 mb-md-3">
          <label for="email" class="form-label"
            ><span v-if="!emailIsValid" class="form-alert" @click="emailAlert">
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
        <div class="mb-2 mb-md-3">
          <label for="password" class="form-label"
            ><span
              v-if="!passwordIsValid"
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
            autocomplete="new-password"
            v-model="user.password"
          />
        </div>
        <div class="my-2 my-md-3 d-grid">
          <button
            type="submit"
            class="btn btn-primary mt-3 p-1"
            :disabled="!formIsValid"
          >
            S'inscrire
          </button>
        </div>
      </div>
    </form>
    <div class="row mt-2 mt-md-3">
      <p class="text-light text-center">
        Déjà un compte ? <br />
        <router-link to="/" class="link">Connectez-vous</router-link>
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
  name: "FormSignup",
  components: {
    BlockAlert,
  },
  data() {
    return {
      user: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      },
      revealAlert: false,
      messageAlert: "",
    };
  },
  computed: {
    firstnameIsValid() {
      let regex = /^[^0-9.,"?!;:#$%&()*+/<>=@[\]\\^_{}|~]{2,}$/;
      return regex.test(this.user.firstname);
    },
    lastnameIsValid() {
      let regex = /^[^0-9.,"?!;:#$%&()*+/<>=@[\]\\^_{}|~]{2,}$/;
      return regex.test(this.user.lastname);
    },
    emailIsValid() {
      let regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      return regex.test(this.user.email);
    },
    passwordIsValid() {
      let regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,})/g;
      return regex.test(this.user.password);
    },
    formIsValid() {
      return (
        this.firstnameIsValid &&
        this.lastnameIsValid &&
        this.emailIsValid &&
        this.passwordIsValid
      );
    },
  },
  methods: {
    async signup() {
      try {
        const credentials = {
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          email: this.user.email,
          password: this.user.password,
        };
        await AuthService.signup(credentials);
        this.$router.push("/");
      } catch (err) {
        console.log(err);
        this.messageAlert = err.response.data.error.errorMessage;
        this.revealAlert = !this.revealAlert;
      }
    },
    toggleAlert() {
      this.revealAlert = !this.revealAlert;
    },
    firstnameAlert() {
      this.messageAlert =
        "Le prénom ne peut contenir ni chiffres, ni caractères spéciaux et doit avoir une longueur minimale de 2 caractères";
      this.revealAlert = !this.revealAlert;
    },
    lastnameAlert() {
      this.messageAlert =
        "Le nom ne peut contenir ni chiffres, ni caractères spéciaux et doit avoir une longueur minimale de 2 caractères";
      this.revealAlert = !this.revealAlert;
    },
    emailAlert() {
      this.messageAlert = "Adresse email incorrecte";
      this.revealAlert = !this.revealAlert;
    },
    passwordAlert() {
      this.messageAlert =
        "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial. Il doit avoir une longueur minimale de 8 caractères";
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
      box-shadow: 0px 0px 0px 4px rgba($white, 0.5);
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
