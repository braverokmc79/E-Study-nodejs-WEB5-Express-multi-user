const JSONdb = require('simple-json-db');
const dbUser = new JSONdb('./db_store/users.json');
module.exports = dbUser;