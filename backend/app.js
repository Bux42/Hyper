const express = require('express')
const session = require('express-session');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const MediaApi = require('./MediaApi');
const TorrentManager = require('./TorrentManager');
const fs = require('fs');
const {
    serialize
} = require('v8');
const {
    allowedNodeEnvironmentFlags
} = require('process');

const app = express();
const port = 3000;

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
const torrentManager = new TorrentManager("F:");

const mongodbUrl = 'mongodb://localhost:27017';
const dbName = 'hypertube';
const mongoClient = new MongoClient(mongodbUrl, {
    useUnifiedTopology: true
});

async function mal_search(mal_id) {
    try {
        await mongoClient.connect();
        const database = mongoClient.db(dbName);
        const mal_imgs = database.collection("mal_imgs");
        // create a document to be inserted
        const query = {
            mal_id: mal_id
        };
        const movie = await mal_imgs.findOne(query);
        return (movie);
    } finally {}
}

async function mal_insert(mal_id, img_src) {
    try {
        await mongoClient.connect();
        const database = mongoClient.db(dbName);
        const mal_imgs = database.collection("mal_imgs");
        // create a document to be inserted
        const doc = {
            mal_id: mal_id,
            img_src: img_src
        };
        const result = await mal_imgs.insertOne(doc);
        return (result);
    } finally {}
}

async function get_mal_imgs() {
    try {
        await mongoClient.connect();
        const database = mongoClient.db(dbName);
        const mal_imgs = database.collection("mal_imgs");
        const result = await mal_imgs.find({}).toArray();
        return (result);
    } finally {}
}

get_mal_imgs().then(d => {
    d.forEach(mal => {
        mediaApi.MalImgs[mal.mal_id] = mal.img_src;
    });
});

var clearDownloads = true;

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
    mediaApi.getMedia(req.query).then(data => {
        res.send(data);

        if (req.query.mediaCategory == "animes") {
            data.forEach(anime => {
                mal_search(anime.mal_id).catch(console.dir).then(d => {
                    if (d == null) {
                        missingImgs.push(anime.mal_id);
                    }
                });
            });
            /*
            var int = setInterval(function () {
                if (missingImgs.length == 0) {
                    clearInterval(int);
                } else {
                    console.log(missingImgs[0]);
                    mediaApi.getMalImg(missingImgs[0]).then(json => {
                        if (json) {
                            mal_insert(missingImgs[0], json.pictures[0].large).then(data => {
                                console.log("Got img ", missingImgs[0]);
                            });
                        } else {
                            console.log(missingImgs[0], "<=== pic not found?");
                        }
                        missingImgs.shift();
                    })
                }

            }, 1500);
            */
        }
    });
});

app.get('/media-episodes', (req, res, next) => {
    console.log("/media-episodes", req.sessionID);
    console.log(req.query);
    mediaApi.getMediaEpisodes(req.query).then(data => {
        res.send(data);
    })
});

app.get('/media-state', (req, res, next) => {
    console.log("/media-state", req.sessionID);
    var torrent = torrentManager.Torrents.find(x => x.FullMagnet == req.query.magnetUrl);
    //req.session.magnetUrl = req.query.magnetUrl;
    console.log("req.query.magnetUrl:", req.query.magnetUrl);
    console.log("req.session.magnetUrl:", req.session.magnetUrl)
    if (!torrent) {
        res.send({
            "ok": false
        });
    } else {
        res.send({
            "ok": true,
            "progress": torrent.DownloadedChunks + " / " + torrent.TotalChunks,
            "progressPercent": (torrent.DownloadedChunks / torrent.TotalChunks) * 100
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

/*
var express = require('express');
var session = require('express-session');
const cors = require('cors');

var app = express();
app.use(cors({origin: [
    "http://localhost:4200"
  ], credentials: true}));
app.use(session({secret: "Shh, its a secret!", resave: true, saveUninitialized: true}));

app.get('/', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
});
app.listen(3000);
*/