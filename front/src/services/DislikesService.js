const Axios = require("axios");

Axios.defaults.baseURL = "http://localhost:3000";
let token = localStorage.getItem("token");
Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

let addDislike = (credentials) => {
  return Axios.post("/dislikes/", credentials);
};

let deleteDislike = (postId) => {
  return Axios.delete(`/dislikes/${postId}`);
};

let getAllDislikes = (postId) => {
  return Axios.get(`/dislikes/${postId}`);
};

export const DislikesService = {
  addDislike,
  deleteDislike,
  getAllDislikes,
};
