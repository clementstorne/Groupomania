<template>
  <div class="post container my-4" v-if="isNotDeleted">
    <div class="col-12">
      <div class="post-header">
        <div class="post-header-informations">
          <div class="post-header-informations-profile-picture">
            <img
              :src="imageUrl"
              alt="Photo de profil de l'utilisateur"
              v-if="imageUrl"
            />
            <img
              :src="defautlImageUrl"
              alt="Photo de profil de l'utilisateur"
              v-else
            />
          </div>
          <div class="post-header-informations-text">
            <p class="post-header-informations-text-author">
              {{ username(firstname, lastname) }}
            </p>
            <p
              class="post-header-informations-text-published"
              v-if="updatedTime"
            >
              Modifié le {{ updatedTime }}
            </p>
            <p
              class="post-header-informations-text-published"
              v-else-if="isModified"
            >
              Modifié le {{ dateFormat(updatedAt) }} à
              {{ timeFormat(updatedAt) }}
            </p>
            <p class="post-header-informations-text-published" v-else>
              Publié le {{ dateFormat(createdAt) }} à
              {{ timeFormat(createdAt) }}
            </p>
          </div>
        </div>
        <div class="post-header-parameters">
          <span
            class="post-header-parameters-edit"
            @click="showPostUpdate"
            v-if="isAllowed"
            >🖊</span
          >
          <span
            class="post-header-parameters-delete"
            @click="showBlockConfirmation"
            v-if="isAllowed"
            >🗑</span
          >
        </div>
      </div>
    </div>
    <div class="post-body">
      <p class="text-start">
        {{ updatedContent || content }}
      </p>
      <img
        :src="updatedMediaUrl"
        alt="null"
        v-if="updatedMediaUrl"
        class="post-img"
      />
      <img :src="mediaUrl" alt="null" v-else-if="mediaUrl" class="post-img" />
    </div>
    <div class="post-interactions row">
      <div class="post-interactions-like col-6 text-center">
        <p class="post-interactions-count" @click.prevent="addLike">
          👍
          <span v-if="liked" class="liked">{{ numberOfLikes }}</span>
          <span v-else> {{ numberOfLikes }}</span>
        </p>
      </div>
      <div class="post-interactions-comment col-6 text-center">
        <p class="post-interactions-count" @click.prevent="addDislike">
          👎 <span v-if="disliked" class="liked">{{ numberOfDislikes }}</span>
          <span v-else> {{ numberOfDislikes }}</span>
        </p>
      </div>
    </div>

    <PostUpdate
      :reveal-post-update="revealPostUpdate"
      :toggle-post-update="togglePostUpdate"
      :post-id="idOfThePostToUpdate"
      v-on:postUpdated="postWasUpdated"
    />

    <BlockConfirmation
      :reveal-confirmation="revealConfirmation"
      :toggle-confirmation="toggleConfirmation"
      :message-confirmation="messageConfirmation"
      @action="deletePost"
    />
  </div>
</template>

<script>
import PostUpdate from "@/components/PostUpdate.vue";
import BlockConfirmation from "@/components/BlockConfirmation.vue";

import { UsersService } from "@/services/UsersService";
import { PostsService } from "@/services/PostsService";
import { LikesService } from "@/services/LikesService";
import { DislikesService } from "@/services/DislikesService";
import profilePicture from "@/assets/user-profile-picture.png";

export default {
  name: "PostShow",
  components: {
    PostUpdate,
    BlockConfirmation,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    usersWhoLiked: {
      type: Array,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    usersWhoDisliked: {
      type: Array,
    },
  },
  data() {
    return {
      user: {
        id: null,
        firstname: null,
        lastname: null,
        email: null,
        imageUrl: null,
        role: null,
      },
      isAllowed: false,
      isModified: false,
      isNotDeleted: true,
      liked: false,
      disliked: false,
      defautlImageUrl: profilePicture,
      revealPostUpdate: false,
      idOfThePostToUpdate: this.id,
      updatedMediaUrl: null,
      updatedContent: null,
      updatedTime: null,
      numberOfLikes: 0,
      numberOfDislikes: 0,
      revealConfirmation: false,
      messageConfirmation: "",
    };
  },
  methods: {
    isAuthor() {
      if (this.userId === this.user.id) {
        this.isAllowed = true;
      }
    },
    isAdmin() {
      if (this.user.role === "admin") {
        this.isAllowed = true;
      }
    },
    hasBeenModified() {
      if (this.updatedAt !== this.createdAt) {
        this.isModified = true;
      }
    },
    computeLikes() {
      this.numberOfLikes = this.likes;
    },
    computeDislikes() {
      this.numberOfDislikes = this.dislikes;
    },
    doUserLike() {
      let likedArray = [];
      for (let k = 0; k < this.usersWhoLiked.length; k++) {
        likedArray.push(this.usersWhoLiked[k].UserId);
      }
      if (likedArray.indexOf(this.user.id) !== -1) {
        this.liked = true;
      }
    },
    doUserDislike() {
      let dislikedArray = [];
      for (let k = 0; k < this.usersWhoDisliked.length; k++) {
        dislikedArray.push(this.usersWhoDisliked[k].UserId);
      }
      if (dislikedArray.indexOf(this.user.id) !== -1) {
        this.disliked = true;
      }
    },
    dateFormat: (date) => {
      return date.split("T")[0].split("-").reverse().join("/");
    },
    timeFormat: (time) => {
      return time.split("T")[1].split(":").slice(0, 2).join(":");
    },
    username: (firstname, lastname) => {
      return firstname + " " + lastname;
    },
    async addLike() {
      const credentials = {
        PostId: this.id,
      };
      try {
        if (this.liked) {
          await LikesService.deleteLike(credentials);
          this.numberOfLikes--;
          this.liked = false;
        } else {
          if (this.disliked) {
            this.numberOfDislikes--;
            this.disliked = false;
          }
          await LikesService.addLike(credentials);
          this.numberOfLikes++;
          this.liked = true;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async addDislike() {
      const credentials = {
        PostId: this.id,
      };
      try {
        if (this.disliked) {
          await DislikesService.deleteDislike(credentials);
          this.numberOfDislikes--;
          this.disliked = false;
        } else {
          if (this.liked) {
            this.numberOfLikes--;
            this.liked = false;
          }
          await DislikesService.addDislike(credentials);
          this.numberOfDislikes++;
          this.disliked = true;
        }
      } catch (err) {
        console.log(err);
      }
    },
    togglePostUpdate() {
      this.revealPostUpdate = !this.revealPostUpdate;
    },
    showPostUpdate() {
      this.revealPostUpdate = !this.revealPostUpdate;
    },
    postWasUpdated($event) {
      this.revealPostUpdate = false;
      this.isModified = true;
      let date = new Date();
      let jour = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      let mois =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1;
      let annee = date.getFullYear();
      let heures =
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      let minutes =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      this.updatedTime = `${jour}/${mois}/${annee} à ${heures}:${minutes}`;
      this.updatedMediaUrl = $event.mediaUrl;
      this.updatedContent = $event.content;
    },
    showBlockConfirmation() {
      this.messageConfirmation = "Êtes-vous sûr de vouloir supprimer ce post ?";
      this.revealConfirmation = !this.revealConfirmation;
    },
    toggleConfirmation() {
      this.revealConfirmation = !this.revealConfirmation;
    },
    async deletePost() {
      try {
        const postId = this.id;
        await PostsService.deletePost(postId);
        this.isNotDeleted = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
  beforeMount() {
    UsersService.getUserData()
      .then((res) => {
        this.user = res.data.data;
        this.isAuthor();
        this.isAdmin();
        this.hasBeenModified();
        this.computeLikes();
        this.computeDislikes();
        this.doUserLike();
        this.doUserDislike();
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style scoped lang="scss">
.post {
  background: $white;
  border-radius: 9px;
  padding: 12px 16px 0;
  &-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-start;
    &-informations {
      display: flex;
      flex-flow: row nowrap;
      &-profile-picture img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 50%;
      }
      &-text {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: flex-start;
        margin-left: 10px;
        &-author {
          font-size: 18px;
          font-weight: 900;
          margin-bottom: 0;
          color: $color-primary;
          &:hover {
            color: darken($color-primary, 5%);
            cursor: pointer;
          }
        }
        &-published {
          font-size: 12px;
          color: $dark-gray;
          margin-bottom: 0;
        }
      }
    }
    &-parameters {
      &-edit {
        margin-right: 20px;
        cursor: pointer;
      }
      &-delete {
        cursor: pointer;
      }
    }
  }
  &-body {
    margin: 12px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & p {
      width: 100%;
    }
    & img {
      text-align: center;
      max-width: 80%;
    }
  }
  &-interactions {
    height: 34px;
    margin: 0;
    padding: 4px 0;
    border-top: solid $medium-gray 1px;
    color: $dark-gray;
    font-weight: 600;
    &-count:hover {
      color: $color-primary;
      font-weight: 900;
      cursor: pointer;
    }
  }
  &-comment {
    margin: 12px 0;
    border-radius: 18px;
    padding: 8px 16px;
    background: $gray;
    border: none;
    &:focus {
      box-shadow: 0px 0px 0px 4px rgba($color-primary, 0.5);
      outline: none;
    }
  }
}

.liked {
  color: $color-primary;
  font-weight: 900;
}
</style>
