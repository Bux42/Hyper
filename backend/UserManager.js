const assert = require('assert');
const bcrypt = require('bcrypt');
const {
    use
} = require('passport');

const saltRounds = 10;

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
                        language: "en",
                        volume: 0.5
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
    getWatchHistoryShows(userId) {
        return new Promise(resolve => {
            var watchHistory = [];
            const collection = this.Db.collection('watch_history_shows');
            collection.find({
                user_id: userId
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                console.log(docs);
                docs.forEach(el => {
                    watchHistory.push({
                        tvdb_id: el.tvdb_id,
                        watch_time: el.watch_time
                    });
                });
                resolve(watchHistory);
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
    isEmailAvailable(email) {
        return new Promise(resolve => {
            const collection = this.Db.collection('users');
            collection.find({
                email: email
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
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
    login(form) {
        return new Promise(resolve => {
            const collection = this.Db.collection('users');
            collection.find({
                email: form.email
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    bcrypt.compare(form.password, docs[0].password, function (err, result) {
                        if (!result) {
                            resolve({
                                Error: "Invalid email or password",
                                Account: null
                            });
                        } else {
                            delete docs[0].password;
                            resolve({
                                Error: null,
                                Account: docs[0]
                            });
                        }
                    });
                } else {
                    resolve({
                        Error: "Invalid email or password",
                        Account: null
                    });
                }
            });
        });
    }
    createAccount(form) {
        return new Promise(resolve => {
            this.isUsernameAvailable(form.username).then(usernameAvailable => {
                if (usernameAvailable) {
                    this.isEmailAvailable(form.emailInput).then(emailAvailable => {
                        if (emailAvailable) {
                            const collection = this.Db.collection('users');
                            var newId = "";
                            for (var i = 0; i < 21; ++i) {
                                newId += Math.floor(Math.random() * 10);
                            }
                            bcrypt.genSalt(saltRounds, function (err, salt) {
                                bcrypt.hash(form.password1, salt, function (err, hash) {
                                    var account = {
                                        id: newId,
                                        first_name: form.firstName,
                                        last_name: form.lastName,
                                        email: form.emailInput,
                                        password: hash,
                                        img: "",
                                        username: form.username,
                                        language: "en",
                                        volume: 0.5
                                    };
                                    collection.insertOne(account);
                                    resolve({
                                        "Error": null
                                    });
                                });
                            });
                        } else {
                            resolve({
                                "Error": {
                                    "emailInputError": "Email already in use"
                                }
                            });
                        }
                    });
                } else {
                    resolve({
                        "Error": {
                            "usernameError": "Username already in use"
                        }
                    });
                }
            });
        });
    }
}