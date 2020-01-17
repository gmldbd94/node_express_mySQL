const express = require('express');
const router = express.Router();
const SendJson = require('../module/SendJson');
const statusCode = require('../module/statusCode');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post } = require('../models');
const { User } = require('../models');
const { Comment } = require('../models');
//게시판 보기 => 페이지네이션 처리하기
router.get('/:page_num', async (req, res) => {
    // const posts = await Post.findAll();
    try{  
        const posts = await Post.findAndCountAll({
            //where: {...},
            order: [["createdAt",'DESC']],
            limit: 5,
            offset: req.params.page_num*5 - 5,
        });
        if(posts.count/5 <= req.params.page_num && posts.count > 5){
            return res.status(statusCode.DB_ERROR).send(SendJson.successFalse(req.params.page_num+"번 페이지 없음"));
        }else{
            return res.status(statusCode.OK).send(SendJson.successTrue(req.params.page_num+"번 페이지 게시물 조회", posts));
        }
        
    } catch(error){
        console.log(error);
        return res.status(statusCode.DB_ERROR).send(SendJson.successFalse("DB error"));
    }
    
});
//게시글 보기
//게시글 => 댓글, 글쓴이, 좋아요, 해쉬태그 등 내용도 자세히 보여주기
router.get('/show/:post_id', async (req, res) =>{
    const post_id = req.params.post_id;
    try {
        const find_post = await Post.findByPk(
            //게시글 id
            post_id,
            {
                //연관된 내용들 불러오기
                include: [
                    {
                        model: User,
                        as: 'writer',
                        attributes: ['id', 'email', 'nick']
                    },
                    // {
                    //     model: Comment,
                    //     where : {parentPostId : post_id},
                    //     as : 'comments',
                    // }
                ]
            }
        );
        if(find_post){
            return res.status(statusCode.OK).send(SendJson.successTrue("게시글 보기 성공", find_post));
        }else{
            return res.status(statusCode.NOT_FOUND).send(SendJson.successFalse("해당 게시물 없음"));
        }
    } catch (error) {
        console.log(error);
        return res.status(statusCode.DB_ERROR).send(SendJson.successFalse(error));
    }
});
//게시글 작성하기
router.post('/create', isLoggedIn, async (req, res) => {
    const {title, content} = req.body;
    const user = req.user;
    try{
        const post = Post.create({
            title : title,
            content : content,
            writerId : user.id,
            active : 1
        });
        return res.status(statusCode.OK).send(SendJson.successTrue("작성완료", post));
    } catch{
        return res.status(statusCode.DB_ERROR).send(SandJson.successFalse(error));
    }
});
//게시글 수정하기
router.put('/update/:post_id', isLoggedIn, async (req, res) => {
    const {title, content} = req.body;
    const user = req.user;
    try{
        const post = await Post.update(
            {title : title, content : content},
            {returning: true, where: {writerId: user.id, id:req.params.post_id}});
        return res.status(statusCode.OK).send(SendJson.successTrue("수정완료", post));
    }catch(error){
        console.log(error);
        return res.status(statusCode.DB_ERROR).send(SendJson.successFalse(error));
    }
});
//게시글 삭제하기
router.delete('/delete/:post_id', isLoggedIn, async (req, res) => {
    try {

        const post = await Post.findOne({where: [{writerId : req.user.id}, {id : req.params.post_id}]})
        await post.destroy();
        return res.status(statusCode.OK).send(SendJson.successTrue("삭제 완료", true));
    } catch (error) {
        console.log(error);
        return res.status(statusCode.DB_ERROR).send(SendJson.successFalse(error));
    }
})

module.exports = router;