const JSONdb = require('simple-json-db');
const dbUser = new JSONdb('./db_store/users.json');
const topics = new JSONdb('./db_store/topics.json');
const { v4 } = require('uuid');
const uuid = () => {
    const tokens = v4().split('-')
    return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
}
const db = {
    users: dbUser,
    topics: topics,
    uuid: uuid
}
module.exports = db