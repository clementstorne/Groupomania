<template>
  <div id="profile">
    <div class="mx-2 mx-md-3 my-md-3">
      <ProfileUpdate />
    </div>
  </div>
</template>

<script>
import ProfileUpdate from "@/components/ProfileUpdate.vue";
export default {
  name: "ProfileView",
  components: {
    ProfileUpdate,
  },
};
</script>

<style scoped lang="scss">
#profile {
  min-height: calc(100vh - 91.2px);
  background: #f0f2f5;
  margin-top: 72px;
  padding: 10px 0;
}
</style>
