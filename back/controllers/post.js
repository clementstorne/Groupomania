const fs = require("fs");

const { User, Like, Dislike } = require("../config/db.config");
const DB = require("../config/db.config");
const Post = DB.Post;

const { RequestError, PostError } = require("../errors/customErrors");

exports.getAllPosts = async (req, res, next) => {
  try {
    let posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["firstname", "lastname", "imageUrl"],
        },
        { model: Like, attributes: ["UserId"] },
        { model: Dislike, attributes: ["UserId"] },
      ],
      attributes: [
        "id",
        "content",
        "createdAt",
        "updatedAt",
        "userId",
        "mediaUrl",
      ],
      order: [["updatedAt", "DESC"]],
    });
    return res.json({ data: posts });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    let postId = parseInt(req.params.id);
    if (!postId) {
      throw new RequestError("Paramètre manquant");
    }
    let post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User,
          attributes: ["firstname", "lastname", "imageUrl"],
        },
        { model: Like, attributes: ["UserId"] },
        { model: Dislike, attributes: ["UserId"] },
      ],
      attributes: [
        "id",
        "content",
        "createdAt",
        "updatedAt",
        "userId",
        "mediaUrl",
      ],
    });
    if (post === null) {
      throw new PostError("Ce post n'existe pas");
    }
    return res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

exports.addPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.auth.id;
    if (!userId || !content) {
      throw new RequestError("Donnée manquante");
    }
    let mediaUrl = "";
    if (req.file && req.file.filename) {
      mediaUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }
    let post = await Post.create({
      ...req.body,
      UserId: req.auth.id,
      mediaUrl,
    });
    return res.json({ message: "Post créé avec succès", data: post });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    let postId = parseInt(req.params.id);
    if (!postId) {
      throw new RequestError("Paramètre manquant");
    }
    let post = await Post.findOne({ where: { id: postId } });
    if (post === null) {
      throw new PostError("Ce post n'existe pas");
    }
    if (post.UserId !== req.auth.id && req.auth.role !== "admin") {
      throw new PostError("Accès refusé", "403");
    } else {
      const content = req.body.content;
      const credentials = { content };
      let mediaUrl = "";
      if (post.mediaUrl) {
        if (req.file && req.file.filename) {
          const filename = post.mediaUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, async () => {
            credentials.mediaUrl = `${req.protocol}://${req.get(
              "host"
            )}/images/${req.file.filename}`;
            await Post.update(credentials, { where: { id: postId } });
            return res.status(200).json({
              message: "Post mis à jour avec succès",
              updatedPost: credentials,
            });
          });
        } else {
          await Post.update(credentials, { where: { id: postId } });
          return res.status(200).json({
            message: "Post mis à jour avec succès",
            updatedPost: credentials,
          });
        }
      } else {
        if (req.file && req.file.filename) {
          credentials.mediaUrl = `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`;
        }
        await Post.update(credentials, { where: { id: postId } });
        return res.status(200).json({
          message: "Post mis à jour avec succès",
          updatedPost: credentials,
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    let postId = parseInt(req.params.id);
    if (!postId) {
      throw new RequestError("Paramètre manquant");
    }
    let post = await Post.findOne({ where: { id: postId } });
    if (post.UserId !== req.auth.id && req.auth.role !== "admin") {
      throw new PostError("Accès refusé", "403");
    } else {
      const filename = post.mediaUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Post.destroy({ where: { id: postId }, force: true })
          .then(() => {
            res.status(200).json({ message: "Post supprimé avec succès" });
          })
          .catch((error) => res.status(400).json({ error }));
      });
    }
  } catch (err) {
    next(err);
  }
};
