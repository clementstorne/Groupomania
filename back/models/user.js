const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING(100),
        defaultValue: "",
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING(100),
        defaultValue: "",
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{72}$/i,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
    },
    { paranoid: true }
  );

  User.checkPassword = async (password, passwordInDb) => {
    return await bcrypt.compare(password, passwordInDb);
  };
  return User;
};
