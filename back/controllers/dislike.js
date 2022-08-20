const { User, Post, Like } = require("../config/db.config");
const DB = require("../config/db.config");
const Dislike = DB.Dislike;

const {
  RequestError,
  DislikeError,
  PostError,
  UserError,
} = require("../errors/customErrors");
const user = require("../models/user");

exports.getAllDislikes = async (req, res, next) => {
  try {
    let postId = parseInt(req.params.postId);
    let dislikes = await Dislike.findAll({
      where: { PostId: postId },
      attributes: ["UserId"],
    });
    return res.json({ data: dislikes });
  } catch (err) {
    next(err);
  }
};

exports.addDislike = async (req, res, next) => {
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
    if (userLikeIndex == -1 && userDislikeIndex !== -1) {
      throw new DislikeError("Post déjà disliké", "409");
    } else if (userLikeIndex !== -1 && userDislikeIndex == -1) {
      await Like.destroy({
        where: { PostId: postId, UserId: userId },
        force: true,
      });
    }
    let dislike = await Dislike.create({ ...req.body, UserId: req.auth.id });
    return res.json({ message: "Dislike créé", data: dislike });
  } catch (err) {
    next(err);
  }
};

exports.deleteDislike = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.auth.id;
    if (!userId || !postId) {
      throw new RequestError("Donnée manquante");
    }
    let dislike = await Dislike.findOne({
      where: { PostId: postId, UserId: userId },
    });
    if (!dislike) {
      throw new DislikeError("Ce dislike n'existe pas", "404");
    } else {
      await Dislike.destroy({
        where: { PostId: postId, UserId: userId },
        force: true,
      });
      return res.json({ message: "Le dislike a été supprimé" });
    }
  } catch (err) {
    next(err);
  }
};
