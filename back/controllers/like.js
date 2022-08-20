const { User, Post, Dislike } = require("../config/db.config");
const DB = require("../config/db.config");
const Like = DB.Like;

const {
  RequestError,
  LikeError,
  PostError,
  UserError,
} = require("../errors/customErrors");
const user = require("../models/user");

exports.getAllLikes = async (req, res, next) => {
  try {
    let postId = parseInt(req.params.postId);
    let likes = await Like.findAll({
      where: { PostId: postId },
      attributes: ["UserId"],
    });
    return res.json({ data: likes });
  } catch (err) {
    next(err);
  }
};

exports.addLike = async (req, res, next) => {
  try {
    const postId = req.body.PostId;
    const userId = req.auth.id;
    if (!userId || !postId) {
      throw new RequestError("Donnée manquante");
    }
    // On récupère la liste des likes correspondant au même post et on extrait les id des utilisateurs qui ont liké
    let likesOnSamePost = await Like.findAll({
      where: { PostId: postId },
      attributes: ["UserId"],
    });
    let usersWhoLikedThatPost = likesOnSamePost.map(
      (item) => item.dataValues.UserId
    );
    // On récupère la liste des dislikes correspondant au même post et on extrait les id des utilisateurs qui ont disliké
    let dislikesOnSamePost = await Dislike.findAll({
      where: { PostId: postId },
      attributes: ["UserId"],
    });
    let usersWhoDislikedThatPost = dislikesOnSamePost.map(
      (item) => item.dataValues.UserId
    );
    // On détermine si l'utilisateur a déjà liké ou disliké cette publication
    const userLikeIndex = usersWhoLikedThatPost.findIndex((id) => id == userId);
    const userDislikeIndex = usersWhoDislikedThatPost.findIndex(
      (id) => id == userId
    );
    if (userLikeIndex !== -1 && userDislikeIndex == -1) {
      throw new LikeError("Post déjà liké", "409");
    } else if (userLikeIndex == -1 && userDislikeIndex !== -1) {
      await Dislike.destroy({
        where: { PostId: postId, UserId: userId },
        force: true,
      });
    }
    let like = await Like.create({ ...req.body, UserId: req.auth.id });
    return res.json({ message: "Like créé", data: like });
  } catch (err) {
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.auth.id;
    if (!userId || !postId) {
      throw new RequestError("Donnée manquante");
    }
    let like = await Like.findOne({
      where: { PostId: postId, UserId: userId },
    });
    if (!like) {
      throw new LikeError("Ce like n'existe pas", "404");
    } else {
      await Like.destroy({
        where: { PostId: postId, UserId: userId },
        force: true,
      });
      return res.json({ message: "Le like a été supprimé" });
    }
  } catch (err) {
    next(err);
  }
};
