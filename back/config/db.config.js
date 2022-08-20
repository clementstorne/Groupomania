const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    dateStrings: ["DATE", "DATETIME"],
    dialectOptions: {
      useUTC: true,
      typeCast: true,
    },
    timezone: "Europe/Paris",
  }
);

const db = {};
db.sequelize = sequelize;
db.User = require("../models/user")(sequelize);
db.Post = require("../models/post")(sequelize);
db.Like = require("../models/like")(sequelize);
db.Dislike = require("../models/dislike")(sequelize);

db.User.hasMany(db.Post, { onDelete: "cascade" });
db.Post.belongsTo(db.User);

db.User.hasMany(db.Like, { onDelete: "cascade" });
db.Like.belongsTo(db.User);

db.User.hasMany(db.Dislike, { onDelete: "cascade" });
db.Dislike.belongsTo(db.User);

db.Post.hasMany(db.Like, { onDelete: "cascade" });
db.Like.belongsTo(db.Post);

db.Post.hasMany(db.Dislike, { onDelete: "cascade" });
db.Dislike.belongsTo(db.Post);

db.sequelize.sync({ alter: true });

module.exports = db;
