const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router({
    mergeParams: true
});
const postRouter = require('./post');
const commentRouter = require('./comment');
const likeRouter = require('./like');
//기존에 작성된 경로
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {title: '내 정보 - NodeBird', user: req.user});
})

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title : '회원가입 - nodeBird',
        user : req.user,
        jionError: req.flash('joinError'),
    });
});

router.get('/', (req, res, next) => {
    res.render('main',{
        title: '회원가입',
        twits : [],
        user: req.user,
        joinError: req.flash('loginError')
    });
});

router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use('/like', likeRouter);

module.exports = router;