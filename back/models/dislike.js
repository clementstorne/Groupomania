const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Dislike = sequelize.define(
    "Dislike",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    },
    { paranoid: true }
  );
  return Dislike;
};
