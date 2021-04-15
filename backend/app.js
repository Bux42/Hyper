const express = require('express')
const session = require('express-session');
const cookieSession = require('cookie-session')
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const MediaApi = require('./MediaApi');
const TorrentManager = require('./TorrentManager');
const UserManager = require('./UserManager');
const fs = require('fs');
const {
    serialize
} = require('v8');
const {
    allowedNodeEnvironmentFlags,
    exit
} = require('process');

var settings = null;

if (fs.existsSync(".env.json")) {
    var data = fs.readFileSync(".env.json", 'utf8');
    settings = JSON.parse(data);
} else {
    console.log(".env.json not found, exit");
    exit();
}

if (!settings) {
    console.log("settings is null, exit");
    exit();
} else {
    console.log(settings);
}

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

const mediaApi = new MediaApi(settings.TorrentFolder);
const torrentManager = new TorrentManager(settings.TorrentFolder);

const mongodbUrl = settings.MongoDbUrl;
const dbName = 'hypertube';
var db = null;

var um = null;

const mongoClient = new MongoClient(mongodbUrl, {
    useUnifiedTopology: true
});


mongoClient.connect(function (err) {
    assert.equal(null, err);
    console.log('Connected successfully to server');
    db = mongoClient.db(dbName);
    um = new UserManager(db);
});

var clearDownloads = false;

if (clearDownloads) {
    var torrentDir = fs.readdirSync("F:\\torrent-stream");

    torrentDir.forEach((el) => {
        if (fs.lstatSync("F:\\torrent-stream\\" + el).isDirectory()) {
            console.log("Deleting folder: " + el);
            fs.rmdirSync("F:\\torrent-stream\\" + el, {
                recursive: true
            });
        } else {
            console.log("Deleting file: " + el);
            fs.unlinkSync("F:\\torrent-stream\\" + el);
        }
    });
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

app.get("/ping", (req, res, next) => {
    res.send({
        "Ping": true
    });
});

var missingImgs = [];

app.get('/media-list', (req, res, next) => {
    console.log("/media-list", req.sessionID);
    console.log(req.query);
    console.log(req.session.userId);
    mediaApi.getMedia(req.query).then(data => {
        res.send(data);
    });
});

app.get('/media-episodes', (req, res, next) => {
    console.log("/media-episodes", req.sessionID);
    console.log(req.query);
    mediaApi.getMediaEpisodes(req.query).then(data => {
        res.send(data);
    });
});

app.get('/media-state', (req, res, next) => {
    console.log("/media-state", req.sessionID);
    var torrent = torrentManager.Torrents.find(x => x.FullMagnet == req.query.magnetUrl);
    //req.session.magnetUrl = req.query.magnetUrl;
    //console.log("req.query.magnetUrl:", req.query.magnetUrl);
    //console.log("req.session.magnetUrl:", req.session.magnetUrl)
    if (!torrent) {
        res.send({
            "ok": false
        });
    } else {
        res.send({
            "ok": true,
            "progress": torrent.DownloadedChunks + " / " + torrent.TotalChunks,
            "progressPercent": ((torrent.DownloadedChunks / torrent.TotalChunks) * 100)
        });
    }
});

app.get('/select-media', (req, res, next) => {
    console.log("/select-media", req.sessionID);
    var torrent = torrentManager.Torrents.find(x => x.FullMagnet == req.query.magnetUrl);
    console.log("req.query.magnetUrl:", req.query.magnetUrl);
    req.session.magnetUrl = req.query.magnetUrl;
    console.log("req.session.magnetUrl:", req.session.magnetUrl);

    if (!torrent) {
        console.log("add magnet: " + req.query.magnetUrl);
        var torrent = torrentManager.addTorrent(req.query.magnetUrl);
        torrent.start((mediaPath) => {
            console.log("torrent.start callback recieved", fs.existsSync(mediaPath));
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
        console.log("magnet found");
        torrent.start((mediaPath) => {
            res.send({
                "ok": true
            });
        });
    }
});

app.get('/player-closed', (req, res, next) => {
    console.log("/player-closed", req.sessionID);
    var torrent = torrentManager.Torrents.find(x => x.FullMagnet == req.query.magnetUrl);
    if (torrent) {
        torrent.Engine.destroy();
        console.log("Engine destroyed");
    }
    res.send({
        "ok": true
    });
});

app.get('/watch-media', (req, res, next) => {
    console.log("/watch-media", req.sessionID);
    console.log(req.headers.range);
    console.log("req.session.magnetUrl:", req.session.magnetUrl);
    var torrent = torrentManager.Torrents.find(x => x.FullMagnet == req.session.magnetUrl);
    if (torrent) {
        console.log("Find torrent, mediaPath: ", torrent.MediaPath);
        const stat = fs.statSync(torrent.MediaPath)
        const fileSize = stat.size
        const range = req.headers.range
        if (range) {
            console.log("range == true");
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1] ?
                parseInt(parts[1], 10) :
                fileSize - 1;
            const chunksize = (end - start) + 1;
            console.log("Start: " + start + " end: " + end + " chunkSize: " + chunksize);
            const file = fs.createReadStream(torrent.MediaPath, {
                start,
                end
            })
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            console.log("range == false");
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            fs.createReadStream(torrent.MediaPath).pipe(res)
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
    console.log("/get-vtt", mediaApi.SubtitlesFolder + req.query.path);
    res.sendFile(mediaApi.SubtitlesFolder + req.query.path);
});

app.get('/set-watch-time', (req, res, next) => {
    console.log("/set-watch-time", req.sessionID);
    if (req.session.userId) {
        console.log(req.query);
        const collection = db.collection('watch_history');

        collection.find({
            user_id: req.session.userId,
            media_id: req.query.mediaId
        }).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log('Found the following records');
            console.log(docs);
            if (!docs.length) {
                console.log("1st watch", req.query.mediaId);
                collection.insertOne({
                    user_id: req.session.userId,
                    media_id: req.query.mediaId,
                    watch_time: req.query.watchTime
                });
            } else {
                var watchTime = docs[0];
                watchTime.watch_time = req.query.watchTime;
                collection.update({
                    user_id: req.session.userId,
                    media_id: req.query.mediaId
                }, watchTime, {
                    upsert: true
                });
            }
        });
    }
    res.send({
        "okay": true
    });
});

app.get('/check-username', (req, res, next) => {
    um.isUsernameAvailable(req.query.username).then(isAvailable => {
        res.send({isAvailable});
    });
});

app.post('/set-username', (req, res, next) => {
    console.log(req.body);
    um.setUsername(req.body.username, req.body.userId).then(result => {
        console.log(result);
        res.send({"Success": result});
    })
});

app.post('/authenticate', (req, res, next) => {
    console.log("/authenticate", req.sessionID);
    delete req.session.userId;
    console.log(req.body);
    if (req.body.AccountType) {
        if (req.body.AccountType == "Google") {
            um.getGoogleAccount(req).then(googleAccount => {
                console.log("googleAccount", googleAccount);
                req.session.userId = googleAccount.id;
                um.getWatchHistory(googleAccount.id).then(wHistory => {
                    console.log("watchHistory:", wHistory);
                    res.send({
                        "okay": true,
                        "account": googleAccount,
                        watchHistory: wHistory
                    });
                });
            })
        }
    }
    /*
    var watchHistory = [];
    console.log("account", account);
    if (req.session.userId) {
        const collection = db.collection('watch_history');

        collection.find({
            user_id: req.session.userId
        }).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log('Found the following records');
            console.log(docs);
            docs.forEach(el => {
                console.log("el:", el);
                watchHistory.push({
                    media_id: el.media_id,
                    watch_time: el.watch_time
                });
            });
            res.send({
                "okay": true,
                "account": account,
                watchHistory: watchHistory
            });
        });
    } else {
        res.send({
            "okay": true,
            "account": account,
            watchHistory: watchHistory
        });
    }
    */
});