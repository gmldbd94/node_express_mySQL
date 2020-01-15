const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

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

module.exports = router;