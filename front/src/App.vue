<template>
  <div id="app">
    <header class="header" v-if="!['login', 'signup'].includes($route.name)">
      <nav class="navbar navbar-expand-lg navbar-dark px-3">
        <router-link to="/home" class="navbar-brand">
          <img src="@/assets/logo.svg" alt="Logo Groupomania" />
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav text-center">
            <li class="nav-item ms-4">
              <router-link class="nav-link" to="/home">Accueil</router-link>
            </li>
            <li class="nav-item ms-4">
              <router-link class="nav-link" to="/profile">Profil</router-link>
            </li>
            <li class="nav-item ms-4">
              <p class="nav-link" @click.prevent="logout">Déconnexion</p>
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <router-view />

    <footer class="footer">© Groupomania - 2022</footer>
  </div>
</template>

<script>
import { AuthService } from "@/services";

export default {
  methods: {
    logout() {
      AuthService.logout();
      this.$router.push("/");
    },
  },
};
</script>

<style scoped lang="scss">
#app {
  background: $gray;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.nav {
  &bar {
    background: $color-primary !important;
    min-height: 72px;
    display: flex;
    flex-flow: row space-between;
    &-brand img {
      height: 40px;
    }
    &-toggler {
      color: $color-secondary !important;
    }
  }
  &-link {
    color: $color-secondary !important;
    cursor: pointer;
    margin-bottom: 0;
    &:hover {
      color: $white !important;
    }
  }
  &-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.router-link-active {
  font-weight: 600;
  color: $white !important;
}
#navbarNav {
  justify-content: flex-end;
}

.footer {
  text-align: center;
  font-size: 0.8em;
}
</style>
