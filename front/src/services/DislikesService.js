const Axios = require("axios");

Axios.defaults.baseURL = "http://localhost:3000";
let token = localStorage.getItem("token");
Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

let addDislike = (credentials) => {
  return Axios.post("/dislikes/", credentials);
};

let deleteDislike = (credentials) => {
  return Axios.delete("/dislikes/", credentials);
};

let getAllDislikes = (PostId) => {
  return Axios.get(`/dislikes/${PostId}`);
};

export const DislikesService = {
  addDislike,
  deleteDislike,
  getAllDislikes,
};
