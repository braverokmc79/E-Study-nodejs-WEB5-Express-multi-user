const db = require("./db");
const bcrypt = require('bcrypt');


module.exports = function (app) {

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            cb(null, { id: user.id, email: user.email, displayName: user.displayName });
        });
    });

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });


    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pwd'
    }, function verify(email, password, cb) {

        const getUser = db.users.get(email);
        console.log("email getUser: ", getUser);

        if (getUser) {

            bcrypt.compare(password, getUser.pwd, function (err, result) {
                if (result) {
                    return cb(null, getUser, { message: 'Welcome.' });
                } else {
                    return cb(null, false, { message: 'Incorrect password.' });
                }
            });

        } else {
            return cb(null, false, { message: 'Incorrect email.' });
        }

    }));


    return passport;
}