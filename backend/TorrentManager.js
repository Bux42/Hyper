const torrentStream = require('torrent-stream');

class Torrent {
    constructor(magnet, torrentFolder) {
        this.TorrentFolder = torrentFolder;
        this.FullMagnet = magnet;
        this.MagnetLink = magnet;
        this.Trackers = [];
        this.MagnetSplit = this.FullMagnet.split("&tr=");
        this.Downloaded = false;
        this.MediaPath = null;
        this.Idle = false;
        this.TotalChunks = 0;
        this.DownloadedChunks = 0;

        if (this.MagnetSplit.length > 1) {
            this.MagnetLink = this.MagnetSplit[0];
            for (var i = 1; i < this.MagnetSplit.length; i++) {
                this.Trackers.push(this.MagnetSplit[i]);
            }
        }
    }
    start(callback) {
        this.Engine = torrentStream(this.MagnetLink, {
            tmp: this.TorrentFolder,
            tracker: this.Trackers.length > 0 ? true : false,
            trackers: this.Trackers,
            verify: true
        });
        var engine = this.Engine;
        var that = this;
        this.Engine.on('ready', function () {
            //console.log(engine);
            that.TotalChunks = engine.torrent.pieces.length;
            engine.files.forEach(function (file) {
                var stream = file.createReadStream();
                if (file.path.endsWith(".mp4") ||
                    file.path.endsWith(".mkv")) {
                    var lowerPath = that.MagnetLink.split("btih:")[1].toLowerCase();
                    that.MediaPath = engine.path + "\\" + file.path;
                }
            });
            if (callback)
            {
                callback(that.MediaPath);
                callback = null;
            }
        });
        this.Engine.on('download', (index) => {
            that.DownloadedChunks++;
            console.log(`Engine downloading chunk: [${index}] ${that.DownloadedChunks} / ${that.TotalChunks}`);
            //console.log('Engine swarm downloaded : ', engine.swarm.downloaded)
        });
        this.Engine.on('idle', () => {
            engine.files.forEach(function (file) {
                //var stream = file.createReadStream();
                if (file.path.endsWith(".mp4") ||
                    file.path.endsWith(".mkv")) {
                    var lowerPath = that.MagnetLink.split("btih:")[1].toLowerCase();
                    that.MediaPath = engine.path + "\\" + file.path;
                }
            });
            console.log("engine idle", this.MediaPath, callback);
            that.DownloadedChunks = that.TotalChunks;
            that.Idle = true;
            engine.destroy();
            if (callback)
            {
                callback(that.MediaPath);
                callback = null;
            }
        });
    }
}

module.exports = class TorrentManager {
    constructor(torrentFolder) {
        this.TorrentFolder = torrentFolder;
        this.Torrents = [];
    }
    addTorrent(magnetLink) {
        var torrent = new Torrent(magnetLink, this.TorrentFolder);
        this.Torrents.push(torrent);
        return (torrent);
    }
    findTorrent(magnetLink) {

    }
}