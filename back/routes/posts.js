const express = require("express");
const postCtrl = require("../controllers/post");
const multer = require("../middlewares/multer");

let router = express.Router();

router.get("/", postCtrl.getAllPosts);
router.get("/:id", postCtrl.getPost);
router.post("", multer, postCtrl.addPost);
router.put("/:id", multer, postCtrl.updatePost);
router.delete("/:id", postCtrl.deletePost);

module.exports = router;
