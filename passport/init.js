var facebook = require("./facebook");
var User = require("../models/user");

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        console.log("serializing user: ");
        console.log(user);
        done(null, user.user._id);
    });

    passport.deserializeUser(function (id, done) {
        console.log("deserializing user:", user);
        models.User.find({
            where: {
                user_id: id
            }
                .then(user => {
                    console.log("deserializing user:", user);
                    done(null, user);
                })
                .catch(err => done(err, null))
        });
    });

    facebook(passport);
};