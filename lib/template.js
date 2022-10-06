var db = require("../lib/db");

module.exports = {
  HTML: function (title, list, body, control, authStatusUI = '<a href="/auth/login">login</a>') {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  }, list: function () {
    const topicList = db.topics.storage;

    var list = '<ul>';
    for (let i in topicList) {
      list = list + `<li><a href="/topic/${topicList[i].id}">${topicList[i].title}</a></li>`;
    }
    list = list + '</ul>';
    return list;
  }
}
