require('dotenv').config()

const assert = require('assert');
const request = require('request');
const bcrypt = require('bcrypt');
const isImageURL = require('valid-image-url');
const {
    use
} = require('passport');
const {
    resolve
} = require('path');

const saltRounds = 10;

var getDb = require('./Database').getDb;

class Account {
    constructor(watchHistory, watchHistoryShows, accountType, account) {
        this.WatchHistory = watchHistory;
        this.WatchHistoryShows = watchHistoryShows;
        this.AccountType = accountType;
        this.Account = account;
    }
}

module.exports = class UserManager {
    getGoogleAccount(req) {
        return new Promise(resolve => {
            const collection = getDb().collection('users');
            collection.find({
                id: req.body.UserData.NT
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                if (!docs.length) {
                    var account = {
                        type: "Google",
                        id: req.body.UserData.NT,
                        first_name: req.body.UserData.xV,
                        last_name: req.body.UserData.sT,
                        email: req.body.UserData.ou,
                        img: req.body.UserData.uK,
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
            const collection = getDb().collection('watch_history_shows');
            collection.find({
                user_id: userId
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                docs.forEach(el => {
                    watchHistory.push({
                        tvdb_id: el.tvdb_id,
                        imdb_id: el.imdb_id,
                        watch_time: el.watch_time,
                        date: el.date,
                        season_number: el.season_number,
                        episode_number: el.episode_number
                    });
                });
                resolve(watchHistory);
            });
        });
    }
    setShowWatchTime(req) {
        return new Promise(resolve => {
            const userCol = getDb().collection('users');
            userCol.updateOne({
                id: req.session.user.Account.id
            }, {
                $set: {
                    volume: req.query.user_volume
                }
            });
            const col = getDb().collection('watch_history');
            col.find({
                user_id: req.session.user.Account.id,
                media_id: req.query.show_imdb_id
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                if (!docs.length) {
                    col.insertOne({
                        user_id: req.session.user.Account.id,
                        media_id: req.query.show_imdb_id,
                        watch_time: 0,
                        date: Date.now()
                    });
                } else {
                    var newvalues = {
                        $set: {
                            date: Date.now()
                        }
                    };
                    collection.updateOne({
                        _id: docs[0]._id
                    }, newvalues);
                }
            });
            const collection = getDb().collection('watch_history_shows');
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
                        watch_time: req.query.watch_time,
                        season_number: req.query.season_number,
                        episode_number: req.query.episode_number,
                        date: Date.now()
                    });
                } else {
                    var newvalues = {
                        $set: {
                            watch_time: req.query.watch_time,
                            date: Date.now()
                        }
                    };
                    collection.updateOne({
                        _id: docs[0]._id
                    }, newvalues);
                }
            });
            resolve(true);
        });
    }
    setWatchTime(req) {
        return new Promise(resolve => {
            const userCol = getDb().collection('users');
            userCol.updateOne({
                id: req.session.user.Account.id
            }, {
                $set: {
                    volume: req.query.user_volume
                }
            });
            const collection = getDb().collection('watch_history');
            collection.find({
                user_id: req.session.user.Account.id,
                media_id: req.query.mediaId
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                if (!docs.length) {
                    collection.insertOne({
                        user_id: req.session.user.Account.id,
                        media_id: req.query.mediaId,
                        watch_time: req.query.watch_time,
                        date: Date.now()
                    });
                    resolve(true);
                } else {
                    var newvalues = {
                        $set: {
                            watch_time: req.query.watch_time,
                            date: Date.now()
                        }
                    };
                    collection.updateOne({
                        _id: docs[0]._id
                    }, newvalues);
                    resolve(true);
                }
            });
        });
    }
    getWatchHistory(userId) {
        return new Promise(resolve => {
            var watchHistory = [];
            const collection = getDb().collection('watch_history');
            collection.find({
                user_id: userId
            }).toArray(function (err, docs) {
                assert.equal(err, null);
                docs.forEach(el => {
                    watchHistory.push({
                        media_id: el.media_id,
                        watch_time: el.watch_time,
                        date: el.date
                    });
                });
                resolve(watchHistory);
            });
        });
    }
    isEmailAvailable(email) {
        return new Promise(resolve => {
            const collection = getDb().collection('users');
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
            const collection = getDb().collection('users');
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
    canUpdateUsername(username, user_id) {
        return new Promise(resolve => {
            const collection = getDb().collection('users');
            collection.find({
                username: username
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    if (docs[0].id != user_id) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                } else {
                    resolve(true);
                }
            });
        });
    }
    setUsername(username, userId) {
        return new Promise(resolve => {
            const collection = getDb().collection('users');
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
            const collection = getDb().collection('users');
            collection.find({
                email: form.email
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    bcrypt.compare(form.password, docs[0].password, function (err, result) {
                        if (!result) {
                            resolve({
                                Error: "Invalid Email or password",
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
                        Error: "Invalid email or Password",
                        Account: null
                    });
                }
            });
        });
    }
    setLanguage(body, userId) {
        let availableLanguages = ["en", "fr"];
        return new Promise(resolve => {
            if (body.langCode != undefined) {
                if (availableLanguages.includes(body.langCode)) {
                    const collection = getDb().collection('users');
                    collection.find({
                        id: userId
                    }).toArray(function (err, docs) {
                        if (docs.length > 0) {
                            docs[0]["language"] = body.langCode;
                            collection.update({
                                id: userId
                            }, docs[0]);
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    }
    createAccount(form) {
        return new Promise(resolve => {
            this.isUsernameAvailable(form.username).then(usernameAvailable => {
                if (usernameAvailable) {
                    this.isEmailAvailable(form.emailInput).then(emailAvailable => {
                        if (emailAvailable) {
                            const collection = getDb().collection('users');
                            var newId = "";
                            for (var i = 0; i < 21; ++i) {
                                newId += Math.floor(Math.random() * 10);
                            }
                            bcrypt.genSalt(saltRounds, function (err, salt) {
                                bcrypt.hash(form.password1, salt, function (err, hash) {
                                    var account = {
                                        type: "Classic",
                                        id: newId,
                                        first_name: form.firstName,
                                        last_name: form.lastName,
                                        email: form.emailInput,
                                        password: hash,
                                        img: "/assets/alphabet/" + form.firstName.toUpperCase()[0] + ".png",
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
                    resolve(new Account(wHistory, wsHistory, accountType, account));
                })
            })
        });
    }
    checkPasswordRecoveryHash(hash, email, db) {
        return new Promise(resolve => {
            const collection = db.collection('users');
            collection.find({
                email: email
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    if (docs[0].emailRecoverySecret == hash) {
                        resolve({
                            "Error": null
                        });
                    } else {
                        resolve({
                            "Error": "Invalid code"
                        });
                    }
                } else {
                    resolve({
                        "Error": "Email not found"
                    });
                }
            });
        });
    }
    changePassword(email, password, db) {
        return new Promise(resolve => {
            const collection = db.collection('users');
            collection.find({
                email: email
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    bcrypt.compare(password, docs[0].password, function (err, result) {
                        if (!result) {
                            bcrypt.genSalt(saltRounds, function (err, salt) {
                                bcrypt.hash(password, salt, function (err, hash) {
                                    docs[0].password = hash;
                                    delete docs[0].emailRecoverySecret;
                                    collection.update({
                                        id: docs[0].id
                                    }, docs[0]);
                                    resolve({
                                        "Error": null
                                    });
                                });
                            });
                        } else {
                            resolve({
                                Error: "New password must be different"
                            });
                        }
                    });
                } else {
                    resolve({
                        "Error": "Email not found"
                    });
                }
            });
        });
    }
    getUser(user_id) {
        return new Promise(resolve => {
            const collection = getDb().collection('users');
            collection.find({
                id: user_id
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    resolve({
                        username: docs[0].username,
                        last_name: docs[0].email,
                        profilePic: docs[0].img,
                    });
                } else {
                    resolve({});
                }
            });
        });
    }
    getUserInfos(user_id, db) {
        return new Promise(resolve => {
            const collection = getDb().collection('users');
            collection.find({
                id: user_id
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    const commentCollection = getDb().collection('comments');
                    commentCollection.find({
                        user_id: user_id
                    }).toArray(function(err, docs2) {
                        resolve({
                            username: docs[0].username,
                            first_name: docs[0].first_name,
                            last_name: docs[0].last_name,
                            profilePic: docs[0].img,
                            commentCount: docs2.length,
                            type: docs[0].type
                        });
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }
    checkSchoolLogin(code) {
        return new Promise(resolve => {
            var url = 'https://api.intra.42.fr/oauth/token';
            request.post(url, {
                form: {
                    grant_type: 'authorization_code',
                    client_id: process.env.school_client_id,
                    client_secret: process.env.school_client_secret,
                    code: code,
                    redirect_uri: 'http://localhost:4200/school-oauth',
                }
            }, function optionalCallback(err, httpResponse, body) {
                var bodyJson = JSON.parse(body);

                if (bodyJson.access_token) {
                    request.get("https://api.intra.42.fr/v2/me", {
                        headers: {
                            'Authorization': 'Bearer ' + bodyJson.access_token
                        }
                    }, function callBack2(err2, httpResponse2, body2) {
                        var user42 = JSON.parse(body2);

                        const collection = getDb().collection('users');
                        collection.find({
                            email: user42.email
                        }).toArray(function (err, docs) {
                            assert.equal(err, null);
                            if (!docs.length) {
                                var newId = "";
                                for (var i = 0; i < 21; ++i) {
                                    newId += Math.floor(Math.random() * 10);
                                }
                                var account = {
                                    type: "School",
                                    id: newId,
                                    first_name: user42.first_name,
                                    last_name: user42.last_name,
                                    email: user42.email,
                                    img: user42.image_url,
                                    username: null,
                                    language: "en",
                                    volume: 0.5
                                };
                                collection.insertOne(account);
                                resolve({
                                    "Error": null,
                                    "Account": account
                                });
                            } else {
                                resolve({
                                    "Error": null,
                                    "Account": docs[0]
                                });
                            }
                        });
                    })
                } else {
                    resolve({
                        "Error": "invalid_grant"
                    });
                }
            });
        });
    }
    updateProfile(form, db, user) {
        return (new Promise(resolve => {
            var that = this;
            var result = {
                Errors: {},
                UpdatedProfile: null
            }
            const collection = db.collection('users');
            collection.find({
                id: user.Account.id
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    that.canUpdateUsername(form.newUsername, user.Account.id).then(available => {
                        if (available) {
                            var firstNameError = that.validFirstname(form.newFirstName);
                            if (firstNameError) {
                                result.Errors["FirstNameError"] = firstNameError;
                                resolve(result);
                            } else {
                                var lastNameError = that.validLastname(form.newLastName);
                                if (lastNameError) {
                                    result.Errors["LastNameError"] = lastNameError;
                                    resolve(result);
                                } else {
                                    isImageURL(form.newImg).then(validImg => {
                                        if (validImg) {
                                            docs[0].first_name = form.newFirstName;
                                            docs[0].last_name = form.newLastName;
                                            docs[0].img = form.newImg;
                                            docs[0].username = form.newUsername;
                                            collection.update({
                                                id: docs[0].id
                                            }, docs[0]);
                                            result.UpdatedProfile = docs[0];
                                            resolve(result);
                                        } else {
                                            result.Errors["ImgError"] = "Invalid img url";
                                            resolve(result);
                                        }
                                    });
                                }
                            }
                        } else {
                            result.Errors["UsernameError"] = "Username not available";
                            resolve(result);
                        }
                    })
                } else {
                    result.Errors["Other"] = "User not found";
                    resolve(result);
                }
            });
        }))
    }
    updateEmail(form, db, user) {
        return (new Promise(resolve => {
            var that = this;
            var result = {
                Errors: {},
                UpdatedProfile: null
            }
            const collection = db.collection('users');
            collection.find({
                id: user.Account.id
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    if (that.validEmail(form.newEmail)) {
                        that.isEmailAvailable(form.newEmail).then(emailAvailable => {
                            if (emailAvailable) {
                                bcrypt.compare(form.changeMailPassword, docs[0].password, function (err, validPassword) {
                                    if (!validPassword) {
                                        result.Errors["ChangeMailPassword"] = "Invalid password";
                                        resolve(result);
                                    } else {
                                        docs[0].email = form.newEmail;
                                        collection.update({
                                            id: docs[0].id
                                        }, docs[0]);
                                        result.UpdatedProfile = docs[0];
                                        resolve(result);
                                    }
                                });
                            } else {
                                result.Errors["ChangeMailEmail"] = "Email not available";
                                resolve(result);
                            }
                        });
                    } else {
                        result.Errors["ChangeMailEmail"] = "Invalid Email";
                        resolve(result);
                    }
                } else {
                    result.Errors["Other"] = "User not found";
                    resolve(result);
                }
            });
        }));
    }
    updatePassword(form, db, user) {
        return (new Promise(resolve => {
            var that = this;
            var result = {
                Errors: {},
                UpdatedProfile: null
            }
            const collection = db.collection('users');
            collection.find({
                id: user.Account.id
            }).toArray(function (err, docs) {
                if (docs.length > 0) {
                    if (form.newPassword == form.newPasswordConfirm) {
                        var passwordError = that.validPassword(form.newPassword);
                        if (!passwordError) {
                            bcrypt.compare(form.changePasswordPassword, docs[0].password, function (err, validPassword) {
                                if (!validPassword) {
                                    result.Errors["ChangePasswordPassword"] = "Invalid password";
                                    resolve(result);
                                } else {
                                    bcrypt.genSalt(saltRounds, function (err, salt) {
                                        bcrypt.hash(form.newPasswordConfirm, salt, function (err, hash) {
                                            docs[0].password = hash;
                                            collection.update({
                                                id: docs[0].id
                                            }, docs[0]);
                                            result.UpdatedProfile = docs[0];
                                            resolve(result);
                                        });
                                    });
                                }
                            });
                        } else {
                            result.Errors["ChangePasswordNew"] = passwordError;
                            resolve(result);
                        }
                    } else {
                        result.Errors["ChangePasswordNew"] = "Password don't match";
                        resolve(result);
                    }
                } else {
                    result.Errors["Other"] = "User not found";
                    resolve(result);
                }
            });
        }));
    }
    getUsers() {
        return new Promise(resolve => {
            const collection = getDb().collection('users');
            collection.find().toArray(function (err, docs) {
                var users = [];
                docs.forEach(user => {
                    users.push({
                        "id": user.id,
                        "username": user.username
                    })
                });
                resolve(users);
            });
        });
    }
    validPassword(password) {
        var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
        var ret = null;
        if (password.length < 8) {
            ret = "Password too short";
        } else if (password.length > 20) {
            ret = "Password too big";
        } else if (!regex.test(password)) {
            ret = "Missing one upper case, lower case, digit or special character";
        }
        return (ret);
    }
    validEmail(email) {
        var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return (regex.test(email));
    }
    validFirstname(first_name) {
        var regex = /^[a-zA-Z\s]*$/;
        var ret = null;
        if (!regex.test(first_name)) {
            ret = "Illegal characters";
        } else if (first_name.length < 3) {
            ret = "Too short";
        } else if (first_name.length > 20) {
            ret = "Too big";
        }
        return (ret);
    }
    validLastname(last_name) {
        var regex = /^[a-zA-Z\s]*$/;
        var ret = null;
        if (!regex.test(last_name)) {
            ret = "Illegal characters";
        } else if (last_name.length < 3) {
            ret = "Too short";
        } else if (last_name.length > 20) {
            ret = "Too big";
        }
        return (ret);
    }
}