var fs = require('fs');
var path = require('path');
var basename  = path.basename(__filename);
const Sequelize = require('sequelize');
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const db = {};

const sequelize = new Sequelize(
   process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
     host: process.env.DB_HOST,
     dialect: 'mysql',
   }
)

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user.js')(sequelize, Sequelize);
db.Post = require('./post.js')(sequelize, Sequelize);
db.Comment = require('./comment.js')(sequelize, Sequelize);
db.Hashtag = require('./hashtag.js')(sequelize, Sequelize);

//작성자와 게시글
db.User.hasMany(db.Post, {foreginKey: 'writerId', as: 'posts'});
db.Post.belongsTo(db.User, {foreginKey: 'writerId', as : 'writer'});

//게시글과 댓글
db.Post.hasMany(db.Comment, {foreginKey: 'parent_post', as: 'comments'});
db.Comment.belongsTo(db.Post, {foreginKey: 'parent_post', as: 'parent_post'});

//작성자와 댓글
db.User.hasMany(db.Comment, {as: 'comments'});
db.Comment.belongsTo(db.User, {as: 'writer'});
//대댓글
db.Comment.hasMany(db.Comment, {as: 'sub_comments'});

//작성자와 좋아요글
db.User.belongsToMany(db.Post, { through: 'Like_Post', as : 'like_posts'});
db.Post.belongsToMany(db.User, { through: 'Like_Post', as : 'like_users'});

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

module.exports = db;
