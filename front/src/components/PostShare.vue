<template>
  <div class="posting container my-4">
    <div class="col-12">
      <div
        class="posting-top d-flex flex-column align-items-center flex-md-row justify-content-start align-items-md-start py-3"
      >
        <div class="posting-top-profile-picture mb-2">
          <img
            :src="user.imageUrl"
            alt="Photo de profil de l'utilisateur"
            v-if="user.imageUrl"
          />
          <img
            :src="defautlImageUrl"
            alt="Photo de profil de l'utilisateur"
            v-else
          />
        </div>
        <div class="posting-top-right ms-2 me-2">
          <textarea
            class="posting-top-message"
            :placeholder="`Quoi de neuf, ${user.firstname} ?`"
            style="height: 100px"
            id="post_content"
            v-model="post.content"
          ></textarea>
          <img
            :src="imageBase64url"
            alt=""
            v-if="imageBase64url"
            class="mt-3"
          />
        </div>
      </div>
      <div
        class="posting-bottom row d-flex flex-column align-items-between flex-md-row justify-content-start align-items-md-start py-2"
      >
        <div class="posting-bottom-picture col-12 col-md-6 d-grid mb-2 p-0">
          <input
            type="file"
            name="image"
            id="media"
            accept="image/png, image/jpg, image/jpeg"
            class="posting-bottom-picture-btn-input"
            @change="setBase64urlImage"
          />
          <button class="btn btn-secondary mx-1">
            <label for="media">📷 Partager une photo</label>
          </button>
        </div>
        <div class="posting-bottom-btn col-12 col-md-6 d-grid mb-2 p-0">
          <button class="btn btn-primary mx-1" @click.prevent="createNewPost">
            Publier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UsersService } from "@/services/UsersService";
import { PostsService } from "@/services/PostsService";
import profilePicture from "@/assets/user-profile-picture.png";

export default {
  name: "PostShare",
  data() {
    return {
      user: {
        id: 0,
        firstname: "",
        lastname: "",
        email: "",
        imageUrl: "",
      },
      post: {
        content: "",
      },
      defautlImageUrl: profilePicture,
      imageBase64url: "",
      imageFile: null,
    };
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
    async createNewPost() {
      try {
        const formData = new FormData();
        if (this.imageFile) {
          formData.append("image", this.imageFile);
        }
        formData.append("content", this.post.content);
        const result = await PostsService.createPost(formData);
        this.$emit("newPostPublished", result.data.data);
        this.post.content = null;
        this.imageFile = null;
        this.imageBase64url = null;
      } catch (err) {
        console.log(err);
      }
    },
  },
  created() {
    UsersService.getUserData()
      .then((res) => {
        this.user = res.data.data;
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style scoped lang="scss">
.posting {
  background: $white;
  border-radius: 9px;
  &-top {
    &-profile-picture {
      & img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    &-right {
      margin-left: 12px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      & img {
        max-width: 100%;
      }
    }
    &-message {
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
  }
  &-bottom {
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
    background: $color-primary !important;
    &:hover {
      background: darken($color-primary, 5%);
    }
    &:focus {
      box-shadow: 0px 0px 0px 4px rgba($color-primary, 0.5);
      outline: none;
    }
  }
  &-secondary {
    background: $color-tertiary !important;
    &:hover {
      background: darken($color-tertiary, 5%);
    }
    &:focus {
      box-shadow: 0px 0px 0px 4px rgba($color-tertiary, 0.5);
      outline: none;
    }
  }
}
</style>
