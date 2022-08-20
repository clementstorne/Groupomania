const bcrypt = require("bcrypt");
const fs = require("fs");

const DB = require("../config/db.config");
const User = DB.User;

const { RequestError, UserError } = require("../errors/customErrors");

exports.getAllUsers = async (req, res, next) => {
  try {
    let users = await User.findAll({
      attributes: ["id", "firstname", "lastname"],
    });
    return res.json({ data: users });
  } catch (err) {
    next(err);
  }
};

// Permet de récupérer les informations sur l'utilisateur grâce au token
exports.getUserData = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    let user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "firstname", "lastname", "email", "imageUrl", "role"],
    });
    return res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let userId = parseInt(req.params.id);
    if (!userId) {
      throw new RequestError("Paramètre manquant");
    }
    let user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "firstname", "lastname"],
    });
    if (user === null) {
      throw new UserError("Cet utilisateur n'existe pas", "404");
    }
    return res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      throw new RequestError("Donnée manquante");
    }
    let user = await User.findOne({ where: { email: email } });
    if (user !== null) {
      throw new UserError(`L'email ${email} est déjà utilisé`, "409");
    }
    let regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,})/g;
    if (!regex.test(password)) {
      throw new UserError("Format du mot de passe incorrect");
    }
    let hash = await bcrypt.hash(password, 10);
    req.body.password = hash;
    user = await User.create(req.body);
    return res.json({ message: "Utilisateur créé avec succès", data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res) => {
  let userId = parseInt(req.params.id);
  if (!userId) {
    throw new RequestError("Paramètre manquant");
  }
  try {
    let user = await User.findOne({ where: { id: userId } });
    if (user === null) {
      throw new UserError("Cet utilisateur n'existe pas", "404");
    }
    const email = req.body.email;
    const credentials = { email };
    if (req.body.password) {
      const password = req.body.password;
      let hash = await bcrypt.hash(password, 10);
      credentials.password = hash;
    }
    if (user.imageUrl) {
      const filename = user.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        if (req.file && req.file.filename) {
          credentials.imageUrl = `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`;
        }
        User.update(credentials, { where: { id: userId } })
          .then(() => {
            res
              .status(200)
              .json({ message: "Utilisateur mis à jour avec succès" });
          })
          .catch((error) => res.status(400).json({ error }));
      });
    } else {
      if (req.file && req.file.filename) {
        credentials.imageUrl = `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`;
      }
      await User.update(credentials, { where: { id: userId } });
      return res
        .status(200)
        .json({ message: "Utilisateur mis à jour avec succès" });
    }
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: err });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let userId = parseInt(req.params.id);
    if (!userId) {
      throw new RequestError("Paramètre manquant");
    }
    let user = await User.findOne({ where: { id: userId } });
    const filename = user.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      User.destroy({ where: { id: userId }, force: true })
        .then(() => {
          res.status(200).json({ message: "Utilisateur supprimé avec succès" });
        })
        .catch((error) => res.status(400).json({ error }));
    });
  } catch (err) {
    next(err);
  }
};
