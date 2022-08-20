const Axios = require("axios");

Axios.defaults.baseURL = "http://localhost:3000";

let getUserData = () => {
  const token = localStorage.getItem("token");
  Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return Axios.get("/users/activeUser");
};

let updateProfile = (formData, userId) => {
  return Axios.put("/users/" + userId, formData);
};

let deleteProfile = (userId) => {
  return Axios.delete("/users/" + userId);
};

export const UsersService = {
  getUserData,
  updateProfile,
  deleteProfile,
};
