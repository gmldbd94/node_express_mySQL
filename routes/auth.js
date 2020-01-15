const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');
const router = express.Router();

const saltRounds = 10;


//회원가입
router.post('/join', isNotLoggedIn, async(req, res, next) => {
    const { email, nick, password } = req.body;
    try{
        //기존 회원 확인
        const exUser = await User.findOne({where: { email }});
        if(exUser){
            req.flash('joinError', '이미 가입된 이메일입니다.');
            return res.redirect('/join');
        }
        //비밀번호 암호화
        // const hash = await bcrypt.hash(password, 12);
        const hash = await bcrypt.hashSync(password, saltRounds);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    }catch(error){
        console.log(error);
        return next(error);
    }
});

//로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            req.flash('loginError', info.message);
            console.log(info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            
            return res.redirect('/');
        })
    })(req, res, next);
});

router.delete('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

//카카오 로그인
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/',}), (req, res) => {
    res.redirect('/');
});

//페이스북
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/',}), (req, res) => {
    res.redirect('/');
});

//구글
router.get('/google', passport.authenticate('google',{ scope: 
    [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
    ] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/',}), (req, res) => {
    res.redirect('/');
});

//네이버
router.get('/naver', passport.authenticate('naver'));
router.get('/naver/callback', passport.authenticate('naver', { failureRedirect: '/',}), (req, res) => {
    res.redirect('/');
});

module.exports = router;

