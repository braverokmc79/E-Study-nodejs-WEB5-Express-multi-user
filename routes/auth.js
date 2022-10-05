var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const JSONdb = require('simple-json-db');
const db = new JSONdb('db.json');


module.exports = function (passport) {

  router.get('/login', function (request, response) {

    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `, '');
    response.send(html);
  });

  router.post('/login_process',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true,
      successFlash: true
    }));


  router.get('/register', function (request, response) {

    var fmsg = request.flash();
    console.log(fmsg);
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - register';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/register_process" method="post">
        <p><input type="text" name="email" placeholder="email" value="egoing7777@gmail.com"></p>
        <p><input type="password" name="pwd" placeholder="password" value="1111"></p>
        <p><input type="password" name="pwd2" placeholder="password" value="1111"></p>
        <p><input type="text" name="displayName" placeholder="display name" value="egoing"></p>
        <p>
          <input type="submit" value="register">
        </p>
      </form>
    `, '');
    response.send(html);
  });


  router.post('/register_process', function (request, response) {
    var post = request.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;

    const user = {
      email: email,
      pwd: pwd,
      displayName: displayName
    }
    db.set("user", user);
    response.redirect("/");

  });


  router.get('/logout', function (req, res, next) {

    req.logout(function (err) {
      if (err) { return next(err); }

      req.session.destroy(function (err) {
        res.redirect('/');
      })
    });
  });

  return router;
}