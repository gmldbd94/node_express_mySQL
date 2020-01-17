const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');
const SendJson = require('../module/SendJson');
const statusCode = require('../module/statusCode');

//salt 크기
const saltRounds = 12;


//회원가입
router.post('/signup', isNotLoggedIn, async(req, res, next) => {
    const { email, nick, password } = req.body;
    try{
        //기존 회원 확인
        const exUser = await User.findOne({where: { email }});
        if(exUser){
            return res.status(statusCode.FORBIDDEN).send(SendJson.successFalse("이미 가입된 이메일입니다."));
        }else{
            //비밀번호 암호화
            const hash = await bcrypt.hashSync(password, saltRounds);
            await User.create({
                email,
                nick,
                password: hash,
            });
            return res.status(statusCode.OK).send(SendJson.successTrue("가입성공", true));
        }
    }catch(error){
        return res.status(statusCode.DB_ERROR).send(SendJson.successFalse(error));
    }
});

//로그인
router.post('/login', isNotLoggedIn, async (req, res, next) => {
    await passport.authenticate('local', async (authError, user, info) => {
        if(authError){
            
            console.error(authError);
            return next(authError);
        }
        if(!user){
            // req.flash('loginError', info.message);
            console.log(info.message);
            return res.status(statusCode.FORBIDDEN).send(SendJson.successFalse(info.message));
        }
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return res.status(statusCode.INTERNAL_SERVER_ERROR).send(SendJson.successFalse(loginError));
            }
            return res.status(statusCode.OK).send(SendJson.successTrue("로그인 성공", null));
        });
    })(req, res, next);
});

//로그아웃
router.delete('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(statusCode.OK).send(SendJson.successTrue("로그아웃 성공", null));
});

//계정 삭제
router.delete('/delete', isLoggedIn, async(req, res) => {
    try{
        const user = await User.findOne({where:{id: req.user.id}});
        await user.destroy();
        return res.status(statusCode.OK).send(SendJson.successTrue("유저 삭제 완료", null));
    } catch(error){
        console.log(error);
        return res.status(statusCode.DB_ERROR).send(SendJson.successFalse("DB 오류"));
    } 
 });
 
 //사용자 정보
 router.get('/profile/:user_id', async (req, res) => {
     try{
         const find_user = await User.findOne({where:{id: req.params.user_id}});
         const find_user_posts = find_user.posts;
         console.log(find_user_posts);
         //유저 있음
         if(find_user){
             return res.status(statusCode.OK).send(SendJson.successTrue("프로필 조회", find_user));
         }
         //유저 없음
         else{
             return res.status(statusCode.NOT_FOUND).send(SendJson.successFalse("해당 유저 없음"));
         }
     }
     catch(error){
         console.log(error);
         return res.status(statusCode.DB_ERROR).send(SendJson.successFalse(error));
     }
 });
 
 //모든 유저 보기
 router.get('/all', async (req, res) => {
     try{
        const all_user = await User.findAll({attributes:{exclude: ['password']}}); 
        return res.status(statusCode.OK).send(SendJson.successTrue("모든 유저", all_user));
     } catch(error){
         console.log(error);
        return res.status(statusCode.DB_ERROR).send(SendJson.successFalse(error));
     }
 });


//SNS 로그인

//카카오 로그인
router.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/',}), (req, res) => {
    res.redirect('/');
});

//페이스북
router.get('/facebook', isNotLoggedIn, passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/',}), (req, res) => {
    res.redirect('/');
});

//구글 
router.get('/google', isNotLoggedIn, passport.authenticate('google',{ scope: [ 
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile' ] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/',}), (req, res) => {
    res.redirect('/');
});

//네이버
router.get('/naver', isNotLoggedIn, passport.authenticate('naver'));
router.get('/naver/callback', passport.authenticate('naver', { failureRedirect: '/',}), (req, res) => {
    res.redirect('/');
});

module.exports = router;

