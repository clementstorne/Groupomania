const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Post = sequelize.define(
    "Post",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        defaultValue: "",
        allowNull: false,
      },
      mediaUrl: {
        type: DataTypes.STRING,
      },
    },
    { paranoid: true }
  );
  return Post;
};
