var FacebookStrategy = require("passport-facebook").Strategy;
var models = require("../models");
var fbConfig = require("../fb.js");

module.exports = function (passport) {
    passport.use(
        "facebook",
        new FacebookStrategy(
            {
                clientID: fbConfig.appID,
                clientSecret: fbConfig.appSecret,
                callbackURL: fbConfig.callbackUrl,
                profileFields: ["id", "displayName", "emails"]
            },

            function (access_token, refresh_token, profile, done) {
                models.User.findOrCreate({
                    where: {
                        authId: profile.Id
                    },
                    defaults: {
                        role: "user"
                    }
                }).spread((unit, created) => {
                    console.log(unit);
                    done(null, unit);
                });
            }
        )
    );
};