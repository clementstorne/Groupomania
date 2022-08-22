<template>
  <div class="profile container py-3 px-3 col-12 py-md-3 px-md-5 col-md-10">
    <div class="profile-username text-center">
      <h2>{{ user.firstname }} {{ user.lastname }}</h2>
    </div>
    <div
      class="profile-picture d-flex flex-column justify-content-center align-items-center mt-3 mb-5"
    >
      <img
        :src="imageBase64url"
        alt="Photo de profil de l'utilisateur"
        v-if="imageBase64url"
      />
      <img
        :src="user.imageUrl"
        alt="Photo de profil de l'utilisateur"
        v-else-if="user.imageUrl"
      />
      <img
        :src="defautlImageUrl"
        alt="Photo de profil de l'utilisateur"
        v-else
      />
      <div class="profile-picture-btn col-10 text-center">
        <input
          type="file"
          name="image"
          id="profilePicture"
          accept="image/png, image/jpg, image/jpeg"
          class="profile-picture-btn-input"
          @change="setBase64urlImage"
        />
        <button class="btn btn-primary col-12 mt-3">
          <label for="profilePicture">Modifier la photo de profil</label>
        </button>
      </div>
    </div>
    <div class="profile-email mb-5 text-center">
      <div class="mb-2">
        <label for="email" class="form-label"
          ><span v-if="!emailIsValid" class="form-alert" @click="emailAlert">
            ⚠️ </span
          ><span v-else> ✅ </span>Email</label
        >
        <input
          type="email"
          class="form-control"
          id="email"
          :placeholder="user.email"
          v-model="user.email"
        />
      </div>
    </div>
    <div class="profile-password mb-5 text-center">
      <div class="mb-2">
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
          placeholder="********"
          v-model="user.password"
        />
      </div>
    </div>

    <button
      class="btn btn-primary col-12 mb-3"
      @click="updateProfile"
      :disabled="!formIsValid"
    >
      Mettre à jour les informations
    </button>

    <div class="profile-delete mb-2">
      <button class="btn btn-secondary col-12" @click="showBlockConfirmation">
        Supprimer le compte
      </button>
    </div>

    <BlockAlert
      :revealAlert="revealAlert"
      :toggleAlert="toggleAlert"
      :messageAlert="messageAlert"
    />
    <BlockConfirmation
      :revealConfirmation="revealConfirmation"
      :toggleConfirmation="toggleConfirmation"
      :messageConfirmation="messageConfirmation"
      @action="deleteProfile"
    />
  </div>
</template>

<script>
import BlockAlert from "@/components/BlockAlert.vue";
import BlockConfirmation from "@/components/BlockConfirmation.vue";

import { UsersService } from "@/services/UsersService";
import profilePicture from "@/assets/user-profile-picture.png";

export default {
  name: "ProfileUpdate",
  components: {
    BlockAlert,
    BlockConfirmation,
  },
  data() {
    return {
      user: {
        id: 0,
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        imageUrl: "",
      },
      imageBase64url: "",
      defautlImageUrl: profilePicture,
      imageFile: null,
      revealAlert: false,
      messageAlert: "",
      revealConfirmation: false,
      messageConfirmation: "",
    };
  },
  computed: {
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
        (this.user.email && this.emailIsValid) ||
        this.imageFile ||
        (this.user.password && this.passwordIsValid)
      );
    },
  },
  beforeMount() {
    UsersService.getUserData()
      .then((res) => {
        this.user = res.data.data;
      })
      .catch((err) => console.log(err));
  },
  methods: {
    setBase64urlImage(e) {
      this.imageFile = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.imageFile);
      fileReader.addEventListener("load", () => {
        this.imageBase64url = fileReader.result;
      });
    },
    updateProfile() {
      const formData = new FormData();
      if (this.imageFile) {
        formData.append("image", this.imageFile);
      }
      if (this.user.email) {
        formData.append("email", this.user.email);
      }
      if (this.user.password) {
        formData.append("password", this.user.password);
      }
      UsersService.updateProfile(formData, this.user.id);
      this.messageAlert = "Le profil a été mis à jour";
      this.revealAlert = !this.revealAlert;
    },
    toggleAlert() {
      this.revealAlert = !this.revealAlert;
    },
    showBlockConfirmation() {
      this.messageConfirmation =
        "Êtes-vous sûr de vouloir supprimer votre profil ?";
      this.revealConfirmation = !this.revealConfirmation;
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
    deleteProfile() {
      UsersService.deleteProfile(this.user.id);
      this.$router.push("/");
    },
    toggleConfirmation() {
      this.revealConfirmation = !this.revealConfirmation;
    },
  },
};
</script>

<style scoped lang="scss">
.profile {
  background-color: $white !important;
  border-radius: 16px;
  &-picture {
    & img {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 50%;
    }
    &-btn {
      position: relative;
      overflow: hidden;
      &-input {
        position: absolute;
        font-size: 50px;
        opacity: 0;
        right: 0;
        top: 0;
        bottom: 0;
        left: 0;
      }
    }
  }
}
.form {
  &-label {
    font-size: 16px;
    font-weight: 400;
    font-weight: 500;
  }
  &-control {
    border: none;
    padding: 12px;
    background: $gray;
    &:focus {
      box-shadow: 0px 0px 0px 4px rgba($color-primary, 0.5);
      outline: none;
    }
  }
  &-alert {
    cursor: pointer;
  }
}
.btn {
  font-weight: 700;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  &-primary {
    background: $color-tertiary;
    &:hover {
      background: darken($color-tertiary, 5%);
    }
    &:focus {
      background: darken($color-tertiary, 5%);
      box-shadow: 0px 0px 0px 4px rgba($color-tertiary, 0.5);
      outline: none;
    }
    &:disabled {
      background: $dark-gray;
      outline: none;
    }
  }
  &-secondary {
    background: $color-primary;
    &:hover {
      background: darken($color-primary, 5%);
    }
    &:focus {
      background: darken($color-primary, 5%);
      box-shadow: 0px 0px 0px 4px rgba($color-primary, 0.5);
      outline: none;
    }
  }
}
</style>
