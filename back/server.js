const express = require("express");
const cors = require("cors");

const path = require("path");

const verifyToken = require("./middlewares/verifyToken");

const DB = require("./config/db.config");

const app = express();

var corsOptions = {
  origin: "http://localhost:8080",
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user_router = require("./routes/users");
app.use("/users", user_router);

const post_router = require("./routes/posts");
app.use("/posts", verifyToken, post_router);

const like_router = require("./routes/likes");
app.use("/likes", verifyToken, like_router);

const dislike_router = require("./routes/dislikes");
app.use("/dislikes", verifyToken, dislike_router);

const auth_router = require("./routes/auth");
app.use("/auth", auth_router);

const errorsHandler = require("./middlewares/errorsHandler");
app.use(errorsHandler);

app.use("/images", express.static(path.join(__dirname, "images")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
