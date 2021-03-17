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
            console.log("engine ready");
            engine.files.forEach(function (file) {
                var stream = file.createReadStream();
                if (file.path.endsWith(".mp4")) {
                    var lowerPath = that.MagnetLink.split("btih:")[1].toLowerCase();
                    console.log(lowerPath);
                    that.MediaPath = engine.path + "\\" + file.path;
                    console.log(file.path);
                }
            });
            callback(that.MediaPath);
        });
        this.Engine.on('download', (index) => {
            console.log(`Engine downloading chunk: [${index}]`);
            //console.log('Engine swarm downloaded : ', engine.swarm.downloaded)
        });
        this.Engine.on('idle', () => {
            console.log("engine idle");
            that.Idle = true;
            engine.destroy();
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