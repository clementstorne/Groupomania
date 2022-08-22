const Axios = require("axios");

Axios.defaults.baseURL = "http://localhost:3000";
let token = localStorage.getItem("token");
Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

let addLike = (credentials) => {
  return Axios.post("/likes/", credentials);
};

let deleteLike = (postId) => {
  return Axios.delete(`/likes/${postId}`);
};

let getAllLikes = (postId) => {
  return Axios.get(`/likes/${postId}`);
};

export const LikesService = {
  addLike,
  deleteLike,
  getAllLikes,
};
