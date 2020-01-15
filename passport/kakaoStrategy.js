const KakaoStrategy = require('passport-kakao').Strategy
require('dotenv').config();
const { User } = require('../models');
module.exports = (passport) => {
    passport.use(new KakaoStrategy({
        clientID : process.env.KAKAO_ID,
        // clientSecret: clientSecret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
        callbackURL : '/auth/kakao/callback',
      }, async (accessToken, refreshToken, profile, done) => {
        // 사용자의 정보는 profile에 들어있다.
        console.log(profile)
        try {
            const exUser = await User.findOne({where: {snsId: profile.id, provider: profile.provider}});
            if(exUser){
                done(null, exUser);
            }
            else{
                const newUser = await User.create({
                    email : profile._json.kakao_account.email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider : profile.provider,
                });
                done(null, newUser);
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
    }));
};
