<template>
  <div class="alert-block" v-if="revealAlert">
    <div class="alert-block-overlay" @click="toggleAlert"></div>
    <div
      class="alert-block-card card px-1 pt-5 pb-2 col-11 px-md-5 mb-md-5 col-md-10"
    >
      <div class="alert-block-btn btn" @click="toggleAlert">✖️</div>
      <p class="alert-block-text">
        {{ messageAlert }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BockAlert",
  props: {
    revealAlert: Boolean,
    toggleAlert: Function,
    messageAlert: String,
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.alert-block {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 16px;
  &-overlay {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  &-card {
    border-left: 8px solid $color-primary;
    border-radius: 8px;
  }
  &-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 8px;
  }
  &-text {
    text-align: center;
  }
}
</style>
