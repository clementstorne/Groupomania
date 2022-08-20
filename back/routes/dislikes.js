const express = require("express");
const dislikeCtrl = require("../controllers/dislike");

let router = express.Router();

router.get("/:postId", dislikeCtrl.getAllDislikes);
router.post("/", dislikeCtrl.addDislike);
router.delete("/:postId", dislikeCtrl.deleteDislike);

module.exports = router;
