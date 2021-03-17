const express = require('express')
const session = require('express-session');
const cors = require('cors');
const MediaApi = require('./MediaApi');
const TorrentManager = require('./TorrentManager');
const fs = require('fs');
const { serialize } = require('v8');
const app = express();
const port = 3000;

const mediaApi = new MediaApi();
const torrentManager = new TorrentManager("F:");

var clearDownloads = false;

if (clearDownloads) {
    var torrentDir = fs.readdirSync("F:\\torrent-stream");

    torrentDir.forEach((el) => {
        if (fs.lstatSync("F:\\torrent-stream\\" + el).isDirectory()) {
            console.log("Deleting folder: " + el);
            fs.rmdirSync("F:\\torrent-stream\\" + el, { recursive: true });
        } else {
            console.log("Deleting file: " + el);
            fs.unlinkSync("F:\\torrent-stream\\" + el);
        }
    });
    /*
    var t = torrentManager.addTorrent("magnet:?xt=urn:btih:F89D822311095B8F2B3C7A35D0737F5DC02E1912&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337");

    t.start(null);
    */
}

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'XCR3rsasa%RDHHH',
    cookie: {
        maxAge: 60000
    }
}));

app.use(cors({
    origin: [
        "http://localhost:4200"
    ],
    credentials: true
}));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

app.get('/media-list', (req, res, next) => {
    console.log(req.query);
    mediaApi.getMedia(req.query).then(data => {
        res.send(data);
    });
});

app.get('/media-episodes', (req, res, next) => {
    console.log(req.query);
    mediaApi.getMediaEpisodes(req.query).then(data => {
        res.send(data);
    })
});

app.get('/select-media', (req, res, next) => {
    var torrent = torrentManager.Torrents.find(x => x.FullMagnet == req.query.magnetUrl);
    req.session.magnetUrl = req.query.magnetUrl;
    if (!torrent) {
        console.log("add magnet: " + req.query.magnetUrl);
        var torrent = torrentManager.addTorrent(req.query.magnetUrl);
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
        console.log("magnet found")
        torrent.start((mediaPath) => {
            res.send({
                "ok": true
            });
        });
    }
});

app.get('/player-closed', (req, res, next) => {
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
    console.log(req.headers.range);
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
                fileSize - 1
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
            console.log("TG");
            console.log(torrent.Engine);
            console.log(torrent.Engine.torrent.pieces.length);
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
    }
});