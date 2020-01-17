const express = require('express');
const router = express.Router();
const SendJson = require('../module/SendJson');
const statusCode = require('../module/statusCode');
const models = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
//좋아요 토글
router.post('/:post_id', isLoggedIn, async (req, res)=>{
    const user = req.user;
    console.log(models.Like_Post);
    try {
        const isLike = await models.Like_Post.findOne({where: {postId : req.params.post_id, userId: user.id}});
        if(isLike){
            await isLike.destroy();
            return res.status(statusCode.OK).send(SendJson.successTrue("좋아요 취소", false));
        }else{
            await Like_Post.create({
                userId: user.id,
                postId: req.params.post_id
            });
            return res.status(statusCode.OK).send(SendJson.successTrue("좋아요 생성", true));    
        }
    } catch (error) {
        console.log(error);
        return res.status(statusCode.DB_ERROR).send(SendJson.successFalse(error));
    }
});

module.exports = router