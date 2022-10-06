var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var auth = require('../lib/auth');
var db = require("../lib/db")


router.get('/create', function (request, response) {
  if (!auth.isOwner(request, response)) {
    response.redirect('/');
    return false;
  }
  var title = 'WEB - create';
  var list = template.list();
  var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '', auth.statusUI(request, response));
  response.send(html);
});

router.post('/create_process', function (request, response) {
  if (!auth.isOwner(request, response)) {
    response.redirect('/');
    return false;
  }
  var post = request.body;
  var title = post.title;
  var description = post.description;

  const id = "topic_" + db.uuid();
  const topic = {
    id: id,
    title: title,
    description: description,
    user_id: request.user.email
  }
  db.topics.set(id, topic);
  response.redirect(`/topic/${id}`);
});

router.get('/update/:pageId', function (request, response) {
  if (!auth.isOwner(request, response)) {
    response.redirect('/');
    return false;
  }

  var topic = db.topics.get(request.params.pageId);
  if (topic.user_id !== request.user.email) {
    return response.redirect("/");
  }

  var title = topic.title;
  var description = topic.description;
  var list = template.list();
  var html = template.HTML(title, list,
    `
        <form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${topic.id}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p><input type="text" name="user_id" placeholder="title" value="${topic.user_id}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
    `<a href="/topic/create">create</a> <a href="/topic/update/${topic.id}">update</a>`,
    auth.statusUI(request, response)
  );
  response.send(html);

});

router.post('/update_process', function (request, response) {
  if (!auth.isOwner(request, response)) {
    response.redirect('/');
    return false;
  }
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;

  const topic = {
    id: id,
    title: title,
    description: description,
    user_id: request.user.email
  }


  for (let item in db.topics.storage) {
    console.log("imte ", item);
    if (item === id) {
      db.topics.delete(id);
      db.topics.set(id, topic);
    }
  }
  response.redirect(`/topic/${id}`);

});

router.post('/delete_process', function (request, response) {
  if (!auth.isOwner(request, response)) {
    response.redirect('/');
    return false;
  }
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    response.redirect('/');
  });
});

router.get('/:pageId', function (request, response, next) {
  const topic = db.topics.get(request.params.pageId);

  console.log(" :pageId : ", topic);
  const user = db.users.get(topic.user_id);

  if (topic) {
    var title = topic.title;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = sanitizeHtml(topic.description, {
      allowedTags: ['h1']
    });


    var list = template.list();

    var html = template.HTML(sanitizedTitle, list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}
        <p>by ${user.displayName}</p>
      `,
      ` <a href="/topic/create">create</a>
            <a href="/topic/update/${topic.id}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="id" value="${topic.id}">
              <input type="submit" value="delete">
            </form>`,
      auth.statusUI(request, response)
    );
    response.send(html);
  } else {
    next(err);
  }

});


module.exports = router;