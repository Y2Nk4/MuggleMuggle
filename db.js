const { MongoClient } = require('mongodb')
const config = require('./config')

module.exports = async function init(config) {
    let mongoDB = new MongoClient(config.url ? config.url : `mongodb://${config.host}`)
    await mongoDB.connect();

    let db = mongoDB.db(config.db)
    // set-up collections
    try { await db.createCollection('users') } catch (e) {}
    try { await db.createCollection('chats') } catch (e) {}

    return db
}