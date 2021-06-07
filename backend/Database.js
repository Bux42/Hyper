require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const mongoClient = new MongoClient(process.env.MongoDbUrl, {
    useUnifiedTopology: true
});

let _db;

function initMongo() {
    return new Promise(resolve => {
        if (_db) {
            resolve(null);
        } else {
            console.log("Hypertube init, checking database");
            mongoClient.connect(function (err) {
                if (!err) {
                    assert.equal(null, err);
                    _db = mongoClient.db("hypertube");
                    resolve(null);
                } else {
                    resolve(err);
                }
            });
        }
    });
}

function getDb() {
    if (!_db) {
        initMongo();
    }
    return _db;
}

module.exports = {
    getDb,
    initMongo
};