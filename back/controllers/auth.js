const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DB = require("../config/db.config");
const User = DB.User;

const { AuthenticationError } = require("../errors/customErrors");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AuthenticationError("Email ou mot de passe manquant");
    }
    let user = await User.findOne({ where: { email: email } });
    if (user === null) {
      throw new AuthenticationError("Cet utilisateur n'existe pas", "404");
    }
    let passwordCheck = await User.checkPassword(password, user.password);
    if (!passwordCheck) {
      throw new AuthenticationError("Mot de passe incorrect", "401");
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_DURING }
    );
    return res.json({ access_token: token });
  } catch (err) {
    next(err);
  }
};
