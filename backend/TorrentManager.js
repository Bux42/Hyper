const torrentStream = require('torrent-stream');

class Torrent {
    constructor(magnet, torrentFile, torrentFolder) {
        this.TorrentFolder = torrentFolder;
        this.FullMagnet = magnet;
        this.MagnetLink = magnet;
        this.TorrentFile = torrentFile;
        this.EngineFile = null;
        if (this.TorrentFile.includes("/")) {
            this.TorrentFile = this.TorrentFile.split("/")[1];
        }
        this.Trackers = [];
        this.MagnetSplit = this.FullMagnet.split("&tr=");
        this.Downloaded = false;
        this.MediaPath = null;
        this.MediaSize = 0;
        this.Idle = false;
        this.TotalChunks = 0;
        this.DownloadedChunks = 0;
        this.Format = "Unknown";
        this.TotalMediaFiles = 0;
        this.RealSeeds = -1;

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
            that.RealSeeds = Object.keys(engine.swarm._peers).length;
            console.log("Engine ready", that.TorrentFile);
            that.TotalChunks = engine.torrent.pieces.length;
            engine.files.forEach(function (file) {
                if (file.path.endsWith(".mp4") ||
                    file.path.endsWith(".mkv") ||
                    file.path.endsWith(".avi")) {
                    that.TotalMediaFiles++;
                    if (that.TorrentFile == "undefined") {
                        file.createReadStream();
                        that.EngineFile = file;
                        that.Format = file.path.substr(file.path.lastIndexOf('.') + 1);
                        var lowerPath = that.MagnetLink.split("btih:")[1].toLowerCase();
                        that.MediaPath = engine.path + "\\" + file.path;
                        that.MediaSize = file.length;
                    } else if (that.TorrentFile == file.path.split("\\")[1]) {
                        file.createReadStream();
                        that.EngineFile = file;
                        that.Format = file.path.substr(file.path.lastIndexOf('.') + 1);
                        var lowerPath = that.MagnetLink.split("btih:")[1].toLowerCase();
                        that.MediaPath = engine.path + "\\" + file.path;
                        that.MediaSize = file.length;
                    }
                }
            });
            if (callback) {
                callback(that.MediaPath);
                callback = null;
            }
        });

        this.Engine.on('download', (index) => {
            that.RealSeeds = Object.keys(engine.swarm._peers).length;
            that.DownloadedChunks++;
            console.log(`Engine downloading chunk: [${index}] ${that.DownloadedChunks} / ${that.TotalChunks}`);
        });
        this.Engine.on('idle', () => {
            engine.files.forEach(function (file) {
                if (file.path.endsWith(".mp4") ||
                    file.path.endsWith(".mkv") ||
                    file.path.endsWith(".avi")) {
                    if (that.TorrentFile == "undefined") {
                        that.Format = file.path.substr(file.path.lastIndexOf('.') + 1);
                        var lowerPath = that.MagnetLink.split("btih:")[1].toLowerCase();
                        that.MediaPath = engine.path + "\\" + file.path;
                    } else if (that.TorrentFile == file.path.split("\\")[1]) {
                        that.Format = file.path.substr(file.path.lastIndexOf('.') + 1);
                        var lowerPath = that.MagnetLink.split("btih:")[1].toLowerCase();
                        that.MediaPath = engine.path + "\\" + file.path;
                    }
                }
            });
            console.log("Engine idle", this.MediaPath, callback);
            that.DownloadedChunks = that.TotalChunks;
            that.Idle = true;
            engine.destroy();
            if (callback) {
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
    addTorrent(magnetLink, torrentFile) {
        var torrent = new Torrent(magnetLink, torrentFile, this.TorrentFolder);
        this.Torrents.push(torrent);
        return (torrent);
    }
}