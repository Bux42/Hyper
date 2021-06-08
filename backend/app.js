require('dotenv').config()

const {
    allowedNodeEnvironmentFlags,
    exit
} = require('process');
const fs = require('fs');
const express = require('express')
const session = require('express-session');
const cookieSession = require('cookie-session')
const cors = require('cors');
const bodyParser = require('body-parser');
const parseRange = require('range-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const MediaApi = require('./MediaApi');
const TorrentManager = require('./TorrentManager');
const UserManager = require('./UserManager');
const MailManager = require('./MailManager');
const CommentManager = require('./CommentManager');

var initMongo = require('./Database').initMongo;
var getDb = require('./Database').getDb;

function checkEnv() {
    var valid = true;
    if (process.env.TorrentFolder) {
        if (fs.existsSync(process.env.TorrentFolder)) {
            console.log("TorrentFolder:", process.env.TorrentFolder);
            if (!fs.existsSync(process.env.TorrentFolder + "/torrent-stream")) {
                console.log("Creating download folder at " + process.env.TorrentFolder + "/torrent-stream");
                fs.mkdirSync(process.env.TorrentFolder + "/torrent-stream");
            }
        } else {
            console.error(process.env.TorrentFolder, "does not exist");
            exit();
        }
    } else {
        console.error("TorrentFolder not found in .env");
        exit();
    }
    if (!process.env.GmailUsername) {
        console.error("GmailUsername not found in .env");
        exit();
    } else {
        console.log("GmailUsername:", process.env.GmailUsername);
    }
    if (!process.env.GmailPassword) {
        console.error("GmailPassword not found in .env");
        exit();
    } else {
        console.log("GmailPassword:", process.env.GmailPassword);
    }
    if (!process.env.school_client_id) {
        console.error("school_client_id not found in .env");
        exit();
    } else {
        console.log("school_client_id:", process.env.school_client_id);
    }
    if (!process.env.school_client_secret) {
        console.error("school_client_secret not found in .env");
        exit();
    } else {
        console.log("school_client_secret:", process.env.school_client_secret);
    }
    if (process.env.MongoDbUrl) {
        initMongo().then((mongoError) => {
            if (mongoError) {
                console.error("Database Error, check mongo service: ", mongoError);
                exit();
            } else {
                console.log('Connected successfully to server');
                db = getDb();
                um = new UserManager(db);
                mm = new MailManager();
                cm = new CommentManager();
                app.listen(port, () => {
                    console.log(`Hypertube listening at http://localhost:${port}`)
                });
                setInterval(() => {
                    deleteOldMedia();
                }, 3600000);
            }
        })
    } else {

    }
    return (valid);
}

checkEnv();

const authRoute = require('./routes/AuthRoute');
const usersRoute = require('./routes/UsersRoute');
const moviesRoute = require('./routes/MoviesRoute');

const {
    serialize
} = require('v8');


const app = express();
const port = 3000;

app.use(bodyParser.json())
app.use(cors({
    origin: [
        "http://localhost:4200"
    ],
    credentials: true
}));
app.use(session({
    secret: "Shh, its a secret!",
    resave: true,
    saveUninitialized: true
}));

const mediaApi = new MediaApi();
const torrentManager = new TorrentManager(process.env.TorrentFolder);

var userToReadStream = {};

var db = null;

var um = null;
var mm = null;
var cm = null;


function deleteOldMedia() {
    var torrentDir = fs.readdirSync("F:\\torrent-stream");

    torrentDir.forEach((el) => {
        var torrentDir = fs.lstatSync("F:\\torrent-stream\\" + el);
        var lastWatched = Date.parse(torrentDir.atime);
        if (torrentDir.isDirectory()) {
            if (el != "subtitles" && Date.now() - lastWatched > 2629800000) { //  > 1 mois
                console.log("Deleting folder: " + el);
                fs.rmdirSync("F:\\torrent-stream\\" + el, {
                    recursive: true
                });
            }
        } else if (Date.now() - lastWatched > 2629800000) {
            console.log("Deleting file: " + el);
            fs.unlinkSync("F:\\torrent-stream\\" + el);
        }
    });
}

var clearDownloads = false;

if (clearDownloads) {
    var torrentDir = fs.readdirSync("F:\\torrent-stream");
    torrentDir.forEach((el) => {
        var torrentDir = fs.lstatSync("F:\\torrent-stream\\" + el);
        if (torrentDir.isDirectory()) {
            if (el != "subtitles") {
                console.log("Deleting folder: " + el);
                fs.rmdirSync("F:\\torrent-stream\\" + el, {
                    recursive: true
                });
            }
        } else {
            console.log("Deleting file: " + el);
            fs.unlinkSync("F:\\torrent-stream\\" + el);
        }
    });
}

app.get('/media-list', (req, res, next) => {
    mediaApi.getMedia(req.query).then(data => {
        res.send(data);
        if (req.query.mediaCategory == "movies") {
            data.forEach(item => {
                const collection = db.collection('movies');
                collection.find({
                    imdb_id: item.imdb_id
                }).toArray(function (err, docs) {
                    if (docs.length == 0) {
                        collection.insertOne(item);
                    }
                });
            });
        }
        if (req.query.mediaCategory == "shows") {
            data.forEach(item => {
                const collection = db.collection('shows');
                collection.find({
                    imdb_id: item.imdb_id
                }).toArray(function (err, docs) {
                    if (docs.length == 0) {
                        collection.insertOne(item);
                    }
                });
            });
        }
    });
});

app.get('/media-episodes', (req, res, next) => {
    mediaApi.getMediaEpisodes(req.query).then(data => {
        res.send(data);
    });
});

app.get('/media-state', (req, res, next) => {
    var torrent = torrentManager.Torrents.find(x => x.FullMagnet == req.query.magnetUrl);

    if (req.query.torrentFile != "undefined") {
        req.session.torrentFile = req.query.torrentFile;
        torrent = torrentManager.Torrents.find(x => x.TorrentFile == req.query.torrentFile);
    } else {
        req.session.torrentFile = undefined;
    }
    if (!torrent) {
        res.send({
            "ok": false,
            "Error": "Torrent not found"
        });
    } else {
        res.send({
            "ok": true,
            "progress": torrent.DownloadedChunks + " / " + torrent.TotalChunks,
            "progressPercent": ((torrent.DownloadedChunks / (torrent.TotalChunks / torrent.TotalMediaFiles)) * 100),
            "format": torrent.Format,
            "size": torrent.MediaSize,
            "realSeeds": torrent.RealSeeds
        });
    }
});

app.get('/select-media', (req, res, next) => {
    var torrent = torrentManager.Torrents.find(x => x.FullMagnet == req.query.magnetUrl);
    if (req.query.torrentFile != "undefined") {
        req.session.torrentFile = req.query.torrentFile;
        torrent = torrentManager.Torrents.find(x => x.TorrentFile == req.query.torrentFile);
    } else {
        req.session.torrentFile = undefined;
    }
    req.session.magnetUrl = req.query.magnetUrl;
    if (!torrent) {
        var torrent = torrentManager.addTorrent(req.query.magnetUrl, req.query.torrentFile);
        torrent.start((mediaPath) => {
            var interval = setInterval(() => {
                if (fs.existsSync(mediaPath)) {
                    res.send({
                        "ok": true
                    });
                    clearInterval(interval);
                }
            }, 200);

        });
    } else {
        torrent.start((mediaPath) => {
            res.send({
                "ok": true
            });
        });
    }
});

app.get('/player-closed', (req, res, next) => {
    var torrent = torrentManager.Torrents.find(x => x.FullMagnet == req.query.magnetUrl);
    if (req.session.torrentFile != undefined) {
        torrent = torrentManager.Torrents.find(x => x.TorrentFile == req.session.torrentFile);
    }
    if (torrent) {
        torrent.Engine.destroy();
        torrent.DownloadedChunks = 0;
        torrent.Downloaded = false;
        torrent.Idle = false;
    }
    if (userToReadStream[req.sessionID]) {
        userToReadStream[req.sessionID].destroy();
        delete userToReadStream[req.sessionID];
    }
    req.session.torrentFile = undefined;
    res.send({
        "ok": true
    });
});

app.get('/watch-media', (req, res, next) => {
    var torrent = torrentManager.Torrents.find(x => x.FullMagnet == req.session.magnetUrl);
    if (req.session.torrentFile != undefined) {
        torrent = torrentManager.Torrents.find(x => x.TorrentFile == req.session.torrentFile);
    }
    if (torrent) {

        const stat = fs.statSync(torrent.MediaPath);
        const fileSize = stat.size;
        const range = req.headers.range;
        var len = torrent.EngineFile.length;

        const ranges = parseRange(len, req.headers.range, {
            combine: true
        });
        if (ranges.type === 'bytes' && ranges !== -1 && ranges !== -2) {
            const range = ranges[0];
            res.status(206);
            res.set({
                'Accept-Ranges': 'bytes',
                'Content-Length': 1 + range.end - range.start,
                'Content-Range': `bytes ${range.start}-${range.end}/${len}`,
                'Content-Type': 'video/mp4'
            });
            if (torrent.Idle) {
                var stream = fs.createReadStream(torrent.MediaPath, {
                    start: range.start,
                    end: range.end
                });
                stream.pipe(res);
            } else {
                var stream = torrent.EngineFile.createReadStream({
                    start: range.start,
                    end: range.end
                });
                stream.pipe(res);
            }
        } else {
            var stream = torrent.EngineFile.createReadStream({
                start: range.start,
                end: range.end
            });
            stream.pipe(res);
        }
    } else {
        console.log(req.session.magnetUrl, " torrent not found?");
    }
});

app.get('/get-subtitles-imdb', (req, res, next) => {
    mediaApi.getSubtitlesByImdbId(req.query, db).then(subs => {
        res.send(subs);
    });
});


app.get('/get-subtitles-src', (req, res, next) => {
    mediaApi.getSubtitlesSrc(req.query).then(src => {
        res.send({
            "subPath": src
        });
    });
});

app.get('/get-vtt', (req, res, next) => {
    res.sendFile(mediaApi.SubtitlesFolder + req.query.path);
});

app.get('/set-show-watch-time', (req, res, next) => {
    if (req.session.user) {
        req.session.user.Account.volume = req.query.user_volume;
        um.setShowWatchTime(req).then((result) => {

        });
        var wh = req.session.user.WatchHistory.find(x => x.media_id == req.query.show_imdb_id);
        if (!wh) {
            var newWh = {
                media_id: req.query.show_imdb_id,
                watch_time: 0,
                date: Date.now()
            };
            req.session.user.WatchHistory.push(newWh);
        }
        var whs = req.session.user.WatchHistoryShows.find(x => x.tvdb_id == req.query.tvdb_id);
        if (whs) {
            whs.watch_time = req.query.watch_time;
            whs.date = Date.now();
        } else {
            req.session.user.WatchHistoryShows.push({
                tvdb_id: req.query.tvdb_id,
                imdb_id: req.query.show_imdb_id,
                watch_time: req.query.watch_time,
                date: Date.now(),
                season_number: req.query.season_number,
                episode_number: req.query.episode_number
            });
        }
    }
    res.send({
        "okay": true
    });
});

app.get('/set-watch-time', (req, res, next) => {
    if (req.session.user) {
        req.session.user.Account.volume = req.query.user_volume;
        um.setWatchTime(req).then((result) => {

        });
        var wh = req.session.user.WatchHistory.find(x => x.media_id == req.query.mediaId);
        if (wh) {
            wh.watch_time = req.query.watch_time;
            wh.date = Date.now();
        } else {
            req.session.user.WatchHistory.push({
                media_id: req.query.mediaId,
                watch_time: req.query.watch_time,
                date: Date.now()
            });
        }
    } else {
        console.error("req.session.user not set", req.session.user);
    }
    res.send({
        "okay": true
    });
});

app.get('/check-username', (req, res, next) => {
    if (req.query.username.length < 3) {
        res.send({
            Available: false,
            Error: "Username too short"
        });
    } else if (req.query.username.length > 15) {
        res.send({
            Available: false,
            Error: "Username too long"
        });
    } else if (/^[A-Za-z0-9]+$/.test(req.query.username) == false) {
        res.send({
            Available: false,
            Error: "Illegal characters"
        });
    } else {
        um.isUsernameAvailable(req.query.username).then(isAvailable => {
            if (isAvailable) {
                res.send({
                    Available: isAvailable,
                    Error: null
                });
            } else {
                res.send({
                    Available: isAvailable,
                    Error: "Username taken"
                });
            }
        });
    }
});

app.post('/set-username', (req, res, next) => {
    um.setUsername(req.body.username, req.session.user.Account.id).then(result => {
        if (result) {
            req.session.user.Account.username = req.body.username;
        }
        res.send({
            "Success": result
        });
    })
});

app.post('/set-language', (req, res, next) => {
    um.setLanguage(req.body, req.session.user.Account.id).then(result => {
        if (result) {
            req.session.user.Account.language = req.body.langCode;
            res.send({
                "Okay": true
            });
        } else {
            res.send({
                "Okay": false
            });
        }
    });
});

app.post('/get-user', (req, res, next) => {
    delete req.session.user;
    if (req.body.AccountType) {
        if (req.body.AccountType == "Google") {
            um.getGoogleAccount(req).then(googleAccount => {
                um.createUserInfos("Google", googleAccount).then(acc => {
                    req.session.user = acc;
                    res.send({
                        "Error": null,
                        "Account": acc
                    });
                });
            })
        }
    }
});

app.post('/register', (req, res, next) => {
    um.createAccount(req.body).then(result => {
        res.send(result);
    });
});

app.post('/login', (req, res, next) => {
    delete req.session.user;
    um.login(req.body).then(result => {
        if (!result.Error) {
            um.createUserInfos("Classic", result.Account).then(acc => {
                req.session.user = acc;
                res.send({
                    "Error": null,
                    "Account": acc
                });
            });
        } else {
            res.send(result);
        }
    });
});

app.get('/logout', (req, res, next) => {
    delete req.session.user;
    res.send({
        "LoggedOut": true
    });
})

app.get('/fetch-movie', (req, res, next) => {
    mediaApi.fetchMovie(req.query.imdb_id, db).then(result => {
        res.send(result);
    });
});

app.get('/fetch-show', (req, res, next) => {
    mediaApi.fetchShow(req.query.imdb_id, db).then(result => {
        res.send(result);
    });
});

app.get('/recover-password', (req, res, next) => {
    um.isEmailAvailable(req.query.email).then(result => {
        if (!result) {
            res.send({
                "Error": null
            });
            mm.sendPasswordRecovery(req.query.email, db);
        } else {
            res.send({
                "Error": "Invalid email"
            });
        }
    });
});

app.post('/check-recovery-code', (req, res, next) => {
    um.checkPasswordRecoveryHash(req.body.form.code, req.body.form.email, db).then(result => {
        res.send(result);
    })
});

app.post('/change-password', (req, res, next) => {
    um.changePassword(req.body.form.email, req.body.form.password, db).then(result => {
        res.send(result);
    })
});

app.get('/get-comments', (req, res, next) => {
    cm.getCommentsByImdbId(req.query.imdb_id, db).then(result => {
        res.send(result);
    });
})


app.get('/get-user-infos', (req, res, next) => {
    um.getUserInfos(req.query.user_id, db).then(result => {
        res.send(result);
    });
})

app.post('/post-comment', (req, res, next) => {
    if (!req.session.user) {
        res.send({
            "Comment": null,
            "Error": "You must be logged in"
        });
    } else {
        if (req.session.user.lastComment) {
            if (Date.now() - req.session.user.lastComment < 3000) {
                res.send({
                    "Comment": null,
                    "Error": "You are going too fast"
                });
            } else {
                cm.postComment(req.body.comment, req.body.imdb_id, req.session.user.Account.id, db).then(result => {
                    res.send({
                        "Comment": result,
                        "Error": null
                    });
                });
                req.session.user.lastComment = Date.now();
            }
        } else {
            cm.postComment(req.body.comment, req.body.imdb_id, req.session.user.Account.id, db).then(result => {
                res.send({
                    "Comment": result,
                    "Error": null
                });
            });
            req.session.user.lastComment = Date.now();
        }
    }

})

app.post('/update-profile', (req, res, next) => {
    um.updateProfile(req.body.form, db, req.session.user).then(result => {
        if (result.UpdatedProfile) {
            req.session.user.Account = result.UpdatedProfile;
        }
        res.send(result);
    })
});

app.post('/update-email', (req, res, next) => {
    um.updateEmail(req.body.form, db, req.session.user).then(result => {
        if (result.UpdatedProfile) {
            req.session.user.Account = result.UpdatedProfile;
        }
        res.send(result);
    })
});

app.post('/update-password', (req, res, next) => {
    um.updatePassword(req.body.form, db, req.session.user).then(result => {
        if (result.UpdatedProfile) {
            req.session.user.Account = result.UpdatedProfile;
        }
        res.send(result);
    })
});

app.use('/auth', authRoute);
app.use('/users', usersRoute);
app.use('/movies', moviesRoute);