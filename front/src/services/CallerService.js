const Axios = require("axios");

Axios.defaults.baseURL = "http://localhost:3000";
let token = localStorage.getItem("token");
Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default Axios;
