const  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();
const { User } = require('../models');
module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        // consumerKey: process.env.GOOGLE_ID,
        // consumerSecret: process.env.GOOGLE_SECRET,
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "/auth/google/callback"
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


