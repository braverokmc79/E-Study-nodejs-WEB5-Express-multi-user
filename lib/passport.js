

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
        process.nextTick(function () {
            cb(null, { email: user.email, nickname: user.nickname });
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