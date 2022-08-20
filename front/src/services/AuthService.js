const Axios = require("axios");

Axios.defaults.baseURL = "http://localhost:3000";
let token = localStorage.getItem("token");
Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

let login = (credentials) => {
  return Axios.post("/auth/login", credentials);
};

let signup = (credentials) => {
  return Axios.post("/users/", credentials);
};

let logout = () => {
  localStorage.removeItem("token");
};

let saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const AuthService = {
  login,
  signup,
  logout,
  saveToken,
};
