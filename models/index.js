const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const db = {};

// // Option 1: Passing parameters separately
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
// });
const sequelize = new Sequelize(
   process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
     host: process.env.DB_HOST,
     dialect: process.env.DB_DIALECT,
   }
)


db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user.js')(sequelize, Sequelize);
db.Post = require('./post.js')(sequelize, Sequelize);
db.Comment = require('./comment.js')(sequelize, Sequelize);
db.Hashtag = require('./hashtag.js')(sequelize, Sequelize);

//작성자와 게시글
db.User.hasMany(db.Post, {foreignKey: 'PostId', as: 'posts'});
db.Post.belongsTo(db.User, {as : 'writer'});

//게시글과 댓글
db.Post.hasMany(db.Comment, {as: 'comments'});
db.Comment.belongsTo(db.Post, {as: 'post'});

//대댓글
db.Comment.hasMany(db.Comment, {as: 'sub_comment'});

//작성자와 좋아요글
db.User.belongsToMany(db.Post, { through: 'Like_Post'});
db.Post.belongsToMany(db.User, { through: 'Like_Post'});

//작성글과 해시태그
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashTag'});
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashTag'});

//Follower와 Following
db.User.belongsToMany(db.User, {
  foreginKey: 'followingId',
  as: 'Followers',
  through: 'Follow',
});
db.User.belongsToMany(db.User, {
  foreginKey: 'followerId',
  as: 'Followings',
  through: 'Follow',
})


//
module.exports = db;
