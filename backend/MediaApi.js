require('dotenv').config()

const rp = require('request-promise');
const fs = require('fs');
const OS = require('opensubtitles-api');
const srt2vtt = require('srt-to-vtt');

module.exports = class MediaApi {
    constructor() {
        this.SubtitlesFolder = process.env.TorrentFolder + "/torrent-stream/subtitles";
        if (!fs.existsSync(this.SubtitlesFolder)) {
            fs.mkdirSync(this.SubtitlesFolder);
        }
        if (!fs.existsSync(this.SubtitlesFolder + "/movies")) {
            fs.mkdirSync(this.SubtitlesFolder + "/movies");
        }
        this.OpenSubtitles = new OS({
            useragent: 'TemporaryUserAgent',
            username: 'zzwokaros',
            password: 'bbapromcle',
            ssl: true
        });
        this.OpenSubtitles.login()
            .then(res => {
            })
            .catch(err => {
                console.log(err);
            });
        this.CachedMedia = {};
        this.CachedMediaEpisodes = {};
    }
    async getMedia(query) {
        // https://tv-v2.api-fetch.sh/movies/1?sort=trending&order=-1&genre=all
        var that = this;
        var popcorn_ru_url = "https://popcorn-ru.tk/" + query.mediaCategory + "/" + query.page + "?sort=" + query.filter + "&order=-1&genre=" + query.genre;
        if (query.keywords.length) {
            popcorn_ru_url += "&keywords=" + query.keywords;
        }
        return await rp({
                uri: popcorn_ru_url
            })
            .then(function (response) {
                that.CachedMedia[query.mediaCategory] = JSON.parse(response);
                return (that.CachedMedia[query.mediaCategory]);
            })
            .catch(function (err) {
                console.error(url, "request failed");
            });
    }
    async getMediaEpisodes(query) {
        if (!this.CachedMediaEpisodes[query.mediaCategory]) {
            this.CachedMediaEpisodes[query.mediaCategory] = {};
        }
        if (!this.CachedMediaEpisodes[query.mediaCategory][query.mediaId]) {
            var that = this;
            var url = "https://popcorn-ru.tk/" + query.mediaCategory.substring(0, query.mediaCategory.length - 1) + "/" + query.mediaId;
            return await rp({
                    uri: url
                })
                .then(function (response) {
                    that.CachedMediaEpisodes[query.mediaCategory][query.mediaId] = JSON.parse(response);
                    return (that.CachedMediaEpisodes[query.mediaCategory][query.mediaId]);
                })
                .catch(function (err) {
                    console.log(err);
                });
        } else {
            return (this.CachedMediaEpisodes[query.mediaCategory][query.mediaId]);
        }
    }
    fetchMovie(imdb_id, db) {
        return new Promise(resolve => {
            const collection = db.collection('movies');
            collection.find({
                imdb_id: imdb_id
            }).toArray(function (err, docs) {
                if (docs.length == 0) {
                    resolve(null);
                } else {
                    resolve(docs[0]);
                }
            });
        });
    }
    fetchShow(imdb_id, db) {
        return new Promise(resolve => {
            const collection = db.collection('shows');
            collection.find({
                imdb_id: imdb_id
            }).toArray(function (err, docs) {
                if (docs.length == 0) {
                    resolve(null);
                } else {
                    resolve(docs[0]);
                }
            });
        });
    }
    async getMalImg(mal_id) {
        var url = "https://api.jikan.moe/v3/anime/" + mal_id + "/pictures";
        return await rp({
                uri: url
            })
            .then(function (response) {
                return (JSON.parse(response));
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    async getSubtitlesSrc(query) {
        return new Promise(resolve => {
            if (fs.existsSync(this.SubtitlesFolder + "/movies/" + query.imdb_id)) {
                var vttPath = this.SubtitlesFolder + "/movies/" + query.imdb_id + "/" + query.lang + ".vtt";
                if (fs.existsSync(vttPath)) {
                    resolve("/movies/" + query.imdb_id + "/" + query.lang + ".vtt");
                } else {
                    resolve(null);
                }
            }
        });
    }
    async getSubtitlesByImdbId(query, db) {
        return new Promise(resolve => {
            var that = this;
            if (query.media_category == "movies") {
                if (!fs.existsSync(this.SubtitlesFolder + "/movies/" + query.imdb_id)) {
                    fs.mkdirSync(this.SubtitlesFolder + "/movies/" + query.imdb_id);
                }
                const collection = db.collection('imdb_movie_subtitles');
                collection.find({
                    imdb_id: query.imdb_id
                }).toArray(function (err, docs) {
                    if (!docs.length) {
                        that.OpenSubtitles.search({
                            imdbid: query.imdb_id
                        }).then(subs => {
                            collection.insertOne({
                                imdb_id: query.imdb_id,
                                subs
                            });
                            resolve(subs);
                            that.downloadMovieSubs(query.imdb_id, subs);
                        });
                    } else {
                        resolve(docs[0].subs);
                        that.downloadMovieSubs(query.imdb_id, docs[0].subs);
                    }
                });

            } else {
                console.log("Not a movie?");
            }
        });
    }
    async downloadMovieSubs(imdb_id, subs) {
        if (!fs.existsSync(this.SubtitlesFolder + "/movies/" + imdb_id)) {
            fs.mkdirSync(this.SubtitlesFolder + "/movies/" + imdb_id);
        }
        Object.keys(subs).forEach(lang => {
            var that = this;
            rp({
                    uri: subs[lang].utf8
                })
                .then(function (response) {
                    fs.writeFile(that.SubtitlesFolder + "/movies/" + imdb_id + "/" + lang + ".srt", response, function (err) {
                        fs.createReadStream(that.SubtitlesFolder + "/movies/" + imdb_id + "/" + lang + ".srt")
                            .pipe(srt2vtt())
                            .pipe(fs.createWriteStream(that.SubtitlesFolder + "/movies/" + imdb_id + "/" + lang + ".vtt"))
                    });
                })
                .catch(function (err) {
                    console.error(err);
                });
        });
    }
}