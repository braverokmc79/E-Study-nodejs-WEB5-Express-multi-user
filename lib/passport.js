const db = require("./dbUser");

module.exports = function (app) {

    var authData = {
        email: 'egoing777@gmail.com',
        password: '111111',
        nickname: 'egoing'
    };

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, cb) {
        console.log(" serializeUser :", user);
        process.nextTick(function () {
            cb(null, { id: user.id, displayName: user.displayName });
        });
    });

    passport.deserializeUser(function (user, cb) {
        const getUser = db.get(user.id);
        console.log("1.deserializeUser - getUser: ", getUser);
        console.log("2.deserializeUser: ", user);

        process.nextTick(function () {
            return cb(null, user);
        });
    });


    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pwd'
    }, function verify(username, password, cb) {

        console.log(" passport ", username, password);

        if (username === authData.email) {
            if (password === authData.password) {
                return cb(null, authData, { message: 'Welcome.' });

            } else {
                return cb(null, false, { message: 'Incorrect password.' });
            }
        } else {

            return cb(null, false, { message: 'Incorrect username.' });
        }

    }));


    return passport;
}