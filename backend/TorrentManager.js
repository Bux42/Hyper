const torrentStream = require('torrent-stream');

class Torrent {
    constructor(magnet, torrentFile, torrentFolder) {
        this.TorrentFolder = torrentFolder;
        this.FullMagnet = magnet;
        this.MagnetLink = magnet;
        this.TorrentFile = torrentFile;
        if (this.TorrentFile.includes("/")) {
            this.TorrentFile = this.TorrentFile.split("/")[1];
        }
        this.Trackers = [];
        this.MagnetSplit = this.FullMagnet.split("&tr=");
        console.log(this.MagnetLink);
        this.Downloaded = false;
        this.MediaPath = null;
        this.MediaSize = 0;
        this.Idle = false;
        this.TotalChunks = 0;
        this.DownloadedChunks = 0;
        this.Format = "Unknown";

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
                        file.path.endsWith(".mkv") ||
                        file.path.endsWith(".avi")) {
                        that.Format = file.path.substr(file.path.lastIndexOf('.') + 1);
                        var lowerPath = that.MagnetLink.split("btih:")[1].toLowerCase();
                        that.MediaPath = engine.path + "\\" + file.path;
                    }
            });
            if (callback) {
                callback(that.MediaPath);
                callback = null;
            }
        });
        //Solar.Opposites.S01.COMPLETE.720p.HULU.WEBRip.x264-GalaxyTV[TGx]\Solar.Opposites.S01E01.720p.HULU.WEBRip.x264-GalaxyTV.mkv
        //Solar.Opposites.S01.COMPLETE.720p.HULU.WEBRip.x264-GalaxyTV[TGx]/Solar.Opposites.S01E01.720p.HULU.WEBRip.x264-GalaxyTV.mkv

        this.Engine.on('download', (index) => {
            that.DownloadedChunks++;
            console.log(`Engine downloading chunk: [${index}] ${that.DownloadedChunks} / ${that.TotalChunks}`);
            //console.log('Engine swarm downloaded : ', engine.swarm.downloaded)
        });
        this.Engine.on('idle', () => {
            engine.files.forEach(function (file) {
                if (that.TorrentFile) {
                    if (file.path.split('\\')[1] == that.TorrentFile) {
                        var stream = file.createReadStream();
                        if (file.path.endsWith(".mp4") ||
                            file.path.endsWith(".mkv") ||
                            file.path.endsWith(".avi")) {
                            var lowerPath = that.MagnetLink.split("btih:")[1].toLowerCase();
                            that.MediaPath = engine.path + "\\" + file.path;
                        }
                    }
                } else {
                    var stream = file.createReadStream();
                    if (file.path.endsWith(".mp4") ||
                        file.path.endsWith(".mkv") ||
                        file.path.endsWith(".avi")) {
                        var lowerPath = that.MagnetLink.split("btih:")[1].toLowerCase();
                        that.MediaPath = engine.path + "\\" + file.path;
                    }
                }
            });
            console.log("engine idle", this.MediaPath, callback);
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