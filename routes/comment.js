const express = require('express');
const router = express.Router();
const SendJson = require('../module/SendJson');
const statusCode = require('../module/statusCode');
const { Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
//댓글 작성
router.post('/create/:post_id', isLoggedIn, async (req, res) => {
    const { comment } = req.body;
    const user = req.user;
    const post = req.params.post_id;
    try {
        const new_comment = await Comment.create({
            comment : comment,
            writerId : user.id,
            parentPostId: post
        });
        res.status(statusCode.OK).send(SendJson.successTrue("댓글 작성 완료", new_comment));
    } catch (error) {
        console.log(error);
        res.status(statusCode.DB_ERROR).send(SendJson.successFalse(error));
    }
});

//댓글 삭제
router.delete('/delete/:comment_id', isLoggedIn, async (req, res) =>{
    const user = req.user;
    try{
        const comment = await Comment.findOne({where: {id: req.params.comment_id, writerId: user.id}});
        console.log(comment);
        if(comment){
            const delete_comment = await comment.destroy();
            return res.status(statusCode.OK).send(SendJson.successTrue("댓글 삭제", delete_comment));
        }else{
            return res.status(statusCode.NO_CONTENT).send(SendJson.successFalse("해당 댓글 없쪙"));
        }
        
    }catch(error){
        console.log(error);
        return res.status(statusCode.DB_ERROR).send(SendJson.successFalse(error));
    }
});
//대댓글 작성

module.exports = router