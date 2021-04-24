const assert = require('assert');
const bcrypt = require('bcrypt');
const {
    use
} = require('passport');
const { resolve } = require('path');

const saltRounds = 10;

class Account {
    constructor(watchHistory, watchHistoryShows, accountType, account) {
        this.WatchHistory = watchHistory;
        this.WatchHistoryShows = watchHistoryShows;
        this.AccountType = accountType;
        this.Account = account;
    }
}

module.exports = class UserManager {
    constructor(db) {
        this.Db = db;
    }
    getGoogleAccount(req) {
        return new Promise(resolve => {
            const collection = this.Db.collection('users');
            console.log("req.body.UserData.QR", req.body.UserData);
            collection.find({
                id: req.body.UserData.FS
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                if (!docs.length) {
                    console.log("create account", req.body.UserData);
                    var account = {
                        id: req.body.UserData.FS,
                        first_name: req.body.UserData.qU,
                        last_name: req.body.UserData.lS,
                        email: req.body.UserData.Qt,
                        img: req.body.UserData.yJ,
                        username: null,
                        language: "en",
                        volume: 0.5
                    };
                    collection.insertOne(account);
                    resolve(account);
                } else {
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
    setShowWatchTime(req) {
        return new Promise(resolve => {
            const userCol = this.Db.collection('users');
            userCol.updateOne({id: req.session.user.Account.id}, {
                $set: {
                    volume: req.query.user_volume
                }
            });
            const col = this.Db.collection('watch_history');
            col.find({
                user_id: req.session.user.Account.id,
                media_id: req.query.show_imdb_id
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                if (!docs.length) {
                    col.insertOne({
                        user_id: req.session.user.Account.id,
                        media_id: req.query.show_imdb_id,
                        watch_time: 0
                    });
                }
            });
            const collection = this.Db.collection('watch_history_shows');
            collection.find({
                user_id: req.session.user.Account.id,
                tvdb_id: req.query.tvdb_id
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                if (!docs.length) {
                    collection.insertOne({
                        user_id: req.session.user.Account.id,
                        tvdb_id: req.query.tvdb_id,
                        imdb_id: req.query.show_imdb_id,
                        watch_time: req.query.watchTime,
                        season_number: req.query.season_number,
                        episode_number: req.query.episode_number,
                        date: Date.now()
                    });
                } else {
                    var newvalues = {
                        $set: {
                            watch_time: req.query.watchTime,
                            date: Date.now()
                        }
                    };
                    collection.updateOne({_id: docs[0]._id}, newvalues);
                }
            });
            resolve(true);
        });
    }
    setWatchTime(req) {
        return new Promise(resolve => {
            const userCol = this.Db.collection('users');
            userCol.updateOne({id: req.session.user.Account.id}, {
                $set: {
                    volume: req.query.user_volume
                }
            });
            const collection = this.Db.collection('watch_history');
            collection.find({
                user_id: req.session.user.Account.id,
                media_id: req.query.mediaId
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                if (!docs.length) {
                    collection.insertOne({
                        user_id: req.session.user.Account.id,
                        media_id: req.query.mediaId,
                        watch_time: req.query.watchTime,
                        date: Date.now()
                    });
                    resolve(true);
                } else {
                    var newvalues = {
                        $set: {
                            watch_time: req.query.watchTime,
                            date: Date.now()
                        }
                    };
                    collection.updateOne({_id: docs[0]._id}, newvalues);
                    resolve(true);
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
    createUserInfos(accountType, account) {
        return new Promise(resolve => {
            this.getWatchHistory(account.id).then(wHistory => {
                this.getWatchHistoryShows(account.id).then(wsHistory => {
                    resolve (new Account(wHistory, wsHistory, accountType, account));
                })
            })
        });
    }
}