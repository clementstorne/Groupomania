<template>
  <div class="post-update" v-if="revealPostUpdate">
    <div class="post-update-overlay" @click="togglePostUpdate"></div>
    <div class="post-update-card card px-1 pt-5 pb-2 px-md-5 mb-md-5">
      <div class="post-update-btn btn" @click="togglePostUpdate">✖️</div>
      <div class="post-update-content ms-2 me-2">
        <textarea
          class="post-update-textarea"
          :placeholder="`Quoi de neuf ?`"
          v-model="post.content"
          style="height: 100px"
          id="post_content"
        ></textarea>
        <img :src="imageBase64url" alt="" v-if="imageBase64url" class="mt-3" />
        <img
          :src="post.mediaUrl"
          alt=""
          v-else-if="post.mediaUrl"
          class="post-img"
        />
      </div>
      <div
        class="post-update-buttons row d-flex flex-column align-items-between flex-md-row justify-content-start align-items-md-start py-2"
      >
        <div
          class="post-update-buttons-picture col-12 col-md-6 d-grid mb-2 p-0"
        >
          <input
            type="file"
            name="image"
            id="media"
            accept="image/png, image/jpg, image/jpeg"
            class="post-update-buttons-picture-btn-input"
            @change="setBase64urlImage"
          />
          <button class="btn btn-secondary mx-1" v-if="this.post.mediaUrl">
            <label for="media">📷 Modifier la photo</label>
          </button>
          <button class="btn btn-secondary mx-1" v-else>
            <label for="media">📷 Ajouter une photo</label>
          </button>
        </div>
        <div class="post-update-buttons-btn col-12 col-md-6 d-grid mb-2 p-0">
          <button class="btn btn-primary mx-1" @click="editPost">
            Modifier le post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PostsService } from "@/services/PostsService";

export default {
  name: "PostUpdate",
  props: {
    revealPostUpdate: Boolean,
    togglePostUpdate: Function,
    postId: Number,
  },
  data() {
    return {
      post: {
        id: null,
        content: "",
        mediaUrl: null,
      },
      imageBase64url: "",
      imageFile: null,
    };
  },
  mounted() {
    PostsService.getSinglePost(this.postId)
      .then((res) => {
        this.post = res.data.data;
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
    async editPost() {
      try {
        const formData = new FormData();
        if (this.imageFile) {
          formData.append("image", this.imageFile);
        }
        formData.append("content", this.post.content);
        const postId = this.post.id;
        const result = await PostsService.editPost(postId, formData);
        this.$emit("postUpdated", result.data.updatedPost);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.post-update {
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
    width: 90%;
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
  &-content {
    text-align: center;
    & img {
      max-width: 100%;
    }
  }
  &-textarea {
    border-radius: 16px;
    padding: 8px 16px;
    background: $gray;
    border: none;
    resize: none;
    width: 100%;
    &:focus {
      box-shadow: 0px 0px 0px 4px rgba($color-primary, 0.5);
      outline: none;
    }
  }
  &-buttons {
    color: $dark-gray;
    font-weight: 600;
    align-items: center;
    margin: 0;
    &-picture {
      position: relative;
      overflow: hidden;
      &:hover {
        color: $color-primary;
        font-weight: 900;
        cursor: pointer;
      }
      &-btn-input {
        position: absolute;
        font-size: 50px;
        opacity: 0;
        right: 0;
        top: 0;
        bottom: 0;
        left: 0;
      }
      & p {
        margin-bottom: 0;
      }
    }
  }
}
.btn {
  font-weight: 700;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  &-primary {
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
  &-secondary {
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
}
</style>
