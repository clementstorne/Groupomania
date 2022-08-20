const Axios = require("axios");

let createPost = (credentials) => {
  return Axios.post("/posts/", credentials);
};

let getSinglePost = (postId) => {
  return Axios.get(`/posts/${postId}`);
};

let getAllPosts = () => {
  return Axios.get("/posts/");
};

let editPost = (postId, credentials) => {
  return Axios.put(`/posts/${postId}`, credentials);
};

let deletePost = (postId) => {
  return Axios.delete(`/posts/${postId}`);
};

export const PostsService = {
  createPost,
  getSinglePost,
  getAllPosts,
  editPost,
  deletePost,
};
