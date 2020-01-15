const FacebookStrategy = require('passport-facebook')
require('dotenv').config();
const { User } = require('../models');
module.exports = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "/auth/facebook/callback",
        // profileFields: ['id', 'displayName', 'photos', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
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
      }
    ));
}