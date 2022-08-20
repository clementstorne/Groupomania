const Axios = require("axios");

Axios.defaults.baseURL = "http://localhost:3000";
let token = localStorage.getItem("token");
Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

let addLike = (credentials) => {
  return Axios.post("/likes/", credentials);
};

let deleteLike = (credentials) => {
  return Axios.delete("/likes/", credentials);
};

let getAllLikes = (PostId) => {
  return Axios.get(`/likes/${PostId}`);
};

export const LikesService = {
  addLike,
  deleteLike,
  getAllLikes,
};
