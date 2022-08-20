const express = require("express");
const likeCtrl = require("../controllers/like");

let router = express.Router();

router.get("/:postId", likeCtrl.getAllLikes);
router.post("/", likeCtrl.addLike);
router.delete("/:postId", likeCtrl.deleteLike);

module.exports = router;
