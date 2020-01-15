const NaverStrategy = require('passport-naver').Strategy;
require('dotenv').config();
const { User } = require('../models');
module.exports = (passport) => {
    passport.use(new NaverStrategy({
        clientID: process.env.NAVER_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: '/auth/naver/callback'
    }, async (taccessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
            const exUser = await User.findOne({where: {snsId: profile.id, provider: profile.provider}});
            if(exUser){
                done(null, exUser);
            }
            else{
                const newUser = await User.create({
                    email : profile._json.email,
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
}
