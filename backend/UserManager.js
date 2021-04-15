const assert = require('assert');
const { use } = require('passport');

module.exports = class UserManager {
    constructor(db) {
        this.Db = db;
    }
    getGoogleAccount(req) {
        return new Promise(resolve => {
            const collection = this.Db.collection('users');
            collection.find({
                id: req.body.UserData.QR
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                if (!docs.length) {
                    console.log("New account");
                    var account = {
                        id: req.body.UserData.QR,
                        first_name: req.body.UserData.AT,
                        last_name: req.body.UserData.wR,
                        email: req.body.UserData.zt,
                        img: req.body.UserData.VI,
                        username: null,
                        language: "en"
                    };
                    collection.insertOne(account);
                    account["userId"] = account.id;
                    resolve(account);
                } else {
                    console.log("Found account:", docs[0]);
                    docs[0]["userId"] = docs[0].id;
                    resolve(docs[0]);
                }
            });
        });
    }
    getWatchHistory(userId) {
        return new Promise(resolve => {
            var watchHistory = [];
            const collection = this.Db.collection('watch_history');
            collection.find({
                user_id: userId
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                console.log(docs);
                docs.forEach(el => {
                    watchHistory.push({
                        media_id: el.media_id,
                        watch_time: el.watch_time
                    });
                });
                resolve(watchHistory);
            });
        });
    }
    isUsernameAvailable(username) {
        return new Promise(resolve => {
            const collection = this.Db.collection('users');
            collection.find({
                username: username
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
    setUsername(username, userId) {
        return new Promise(resolve => {
            const collection = this.Db.collection('users');
            collection.find({
                id: userId
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    docs[0]["username"] = username;
                    collection.update({
                        id: userId
                    }, docs[0]);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }
}