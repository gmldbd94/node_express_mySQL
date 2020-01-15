const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
// const kakao = require('./kakaoStrategy');
const { User } = require('../models');
module.exports = (passport) => {
    //serializeUser는 req.session 객체에 어떤 데이터를 저장할지를 선택합니다.
    passport.serializeUser((user, done) => {
        //모든 유저정보를 저장하기에는 비효율적이므로 user.id인자값만 저장을하고 deserializeUser 메서드를 통해서 유저 정보를 매번 요청을 합니다.
        //즉 req.session에는 사용자 id 값만 저장이 됩니다.
        done(null, user.id);
    });

    //session의 값을 통해서 User의 값을 호출하고 req.user에 호출한 값을 매번 요청하고 저장합니다.
    passport.deserializeUser((id, done) => {
       User.findOne({ where: { id }})
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local(passport);
    kakao(passport);
};