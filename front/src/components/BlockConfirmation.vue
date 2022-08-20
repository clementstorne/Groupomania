<template>
  <div class="confirmation-block" v-if="revealConfirmation">
    <div class="confirmation-block-overlay" @click="toggleConfirmation"></div>
    <div
      class="confirmation-block-card card px-1 pt-5 pb-2 col-11 px-md-5 mb-md-5 col-md-10"
    >
      <div class="confirmation-block-toggle btn" @click="toggleConfirmation">
        ✖️
      </div>
      <p class="confirmation-block-text">
        {{ messageConfirmation }}
      </p>
      <div class="confirmation-block-buttons">
        <div
          class="confirmation-block-btn confirmation-block-btn-yes btn"
          @click="$emit('action')"
        >
          Oui
        </div>
        <div
          class="confirmation-block-btn confirmation-block-btn-no btn"
          @click="toggleConfirmation"
        >
          Non
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlockConfirmation",
  props: {
    revealConfirmation: Boolean,
    toggleConfirmation: Function,
    messageConfirmation: String,
  },
  data() {
    return {};
  },
  emits: ["action"],
};
</script>

<style scoped lang="scss">
.confirmation-block {
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
    padding: 60px 50px 30px;
    border-left: 8px solid $color-primary;
    width: 70%;
    border-radius: 8px;
  }
  &-toggle {
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 8px;
  }
  &-text {
    text-align: center;
  }
  &-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-btn {
    margin: 0 10px;
    width: 35%;
    font-weight: 700;
    font-size: 16px;
    border-radius: 8px;
    border: none;
    color: $white !important;
    &-yes {
      background: $color-tertiary;
      &:hover {
        background: darken($color-tertiary, 5%);
      }
      &:focus {
        background: darken($color-tertiary, 5%);
        box-shadow: 0px 0px 0px 4px rgba($color-tertiary, 0.5);
        outline: none;
      }
    }
    &-no {
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
}
</style>
