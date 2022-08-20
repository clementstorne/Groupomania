const express = require("express");
const userCtrl = require("../controllers/user");
const verifyToken = require("../middlewares/verifyToken");
const multer = require("../middlewares/multer");

let router = express.Router();

router.get("/", verifyToken, userCtrl.getAllUsers);
router.get("/activeUser", verifyToken, userCtrl.getUserData);
router.get("/:id", verifyToken, userCtrl.getUser);
router.post("/", userCtrl.addUser);
router.put("/:id", verifyToken, multer, userCtrl.updateUser);
router.delete("/:id", verifyToken, userCtrl.deleteUser);

module.exports = router;
