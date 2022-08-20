<template>
  <div class="home">
    <div class="mx-2">
      <PostShare v-on:newPostPublished="newPostWasPublished" />
      <PostShow
        v-if="isThisPostNew"
        :id="newPost.id"
        :user-id="newPost.userId"
        :firstname="newPost.firstname"
        :lastname="newPost.lastname"
        :created-at="newPost.createdAt"
        :updated-at="newPost.updatedAt"
        :image-url="newPost.imageUrl"
        :content="newPost.content"
        :media-url="newPost.mediaUrl"
        :likes="newPost.likes"
        :users-who-liked="newPost.usersWhoLiked"
        :dislikes="newPost.dislikes"
        :users-who-disliked="newPost.usersWhoDisliked"
      />
      <PostShow
        v-for="post in posts"
        :key="post.id"
        :id="post.id"
        :user-id="post.userId"
        :firstname="post.User.firstname"
        :lastname="post.User.lastname"
        :created-at="post.createdAt"
        :updated-at="post.updatedAt"
        :image-url="post.User.imageUrl"
        :content="post.content"
        :media-url="post.mediaUrl"
        :likes="post.Likes.length"
        :users-who-liked="post.Likes"
        :dislikes="post.Dislikes.length"
        :users-who-disliked="post.Dislikes"
      />
    </div>
  </div>
</template>

<script>
import PostShow from "@/components/PostShow.vue";
import PostShare from "../components/PostShare.vue";

import { UsersService } from "@/services/UsersService";
import { PostsService } from "@/services/PostsService";

export default {
  name: "HomeView",
  components: {
    PostShow,
    PostShare,
  },
  data() {
    return {
      posts: [],
      user: {
        id: 0,
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        imageUrl: "",
      },
      isThisPostNew: false,
      newPost: {
        id: null,
        userId: null,
        firstname: null,
        lastname: null,
        createdAt: null,
        updatedAt: null,
        imageUrl: null,
        content: null,
        mediaUrl: null,
        likes: 0,
        usersWhoLiked: [],
        dislikes: 0,
        usersWhoDisliked: [],
      },
    };
  },
  beforeMount() {
    UsersService.getUserData()
      .then((res) => {
        this.user = res.data.data;
      })
      .catch((err) => console.log(err));
  },
  mounted() {
    PostsService.getAllPosts()
      .then((res) => {
        this.posts = res.data.data;
      })
      .catch((err) => console.log(err));
  },
  methods: {
    newPostWasPublished($event) {
      this.isThisPostNew = true;
      this.newPost.id = $event.id;
      this.newPost.userId = $event.UserId;
      this.newPost.firstname = this.user.firstname;
      this.newPost.lastname = this.user.lastname;
      this.newPost.createdAt = $event.createdAt;
      this.newPost.updatedAt = $event.updatedAt;
      this.newPost.imageUrl = this.user.imageUrl;
      this.newPost.content = $event.content;
      this.newPost.mediaUrl = $event.mediaUrl;
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  min-height: calc(100vh - 91.2px);
  background: #f0f2f5;
  margin-top: 72px;
  padding: 10px 0;
}
</style>
