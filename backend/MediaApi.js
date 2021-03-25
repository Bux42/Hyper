const rp = require('request-promise');

module.exports = class MediaApi {
    constructor() {
        this.CachedMedia = {};
        this.CachedMediaEpisodes = {};
    }
    async getMedia(query) {
        var that = this;
        var url = "https://tv-v2.api-fetch.sh/" + query.mediaCategory + "/" + query.page + "?sort=trending&order=-1&genre=" + query.genre;
        console.log(url);
        return await rp({
                uri: url
            })
            .then(function (response) {
                that.CachedMedia[query.mediaCategory] = JSON.parse(response);
                if (query.mediaCategory == "animes") {
                    that.CachedMedia[query.mediaCategory].forEach(element => {
                        element.images.banner = "https://media.kitsu.io/anime/poster_images/" + element._id + "/large.jpg";
                    });
                }
                return (that.CachedMedia[query.mediaCategory]);
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    async getMediaEpisodes(query) {
        if (!this.CachedMediaEpisodes[query.mediaCategory]) {
            this.CachedMediaEpisodes[query.mediaCategory] = {};
        }
        if (!this.CachedMediaEpisodes[query.mediaCategory][query.mediaId]) {
            var that = this;
            var url = "https://tv-v2.api-fetch.sh/" + query.mediaCategory.substring(0, query.mediaCategory.length - 1) + "/" + query.mediaId;
            return await rp({
                    uri: url
                })
                .then(function (response) {
                    that.CachedMediaEpisodes[query.mediaCategory][query.mediaId] = JSON.parse(response);
                    if (query.mediaCategory == "animes") {
                        that.CachedMediaEpisodes[query.mediaCategory][query.mediaId].episodes.forEach(el => {
                            el.episode = parseInt(el.episode);
                            el.season = parseInt(el.season);
                        });
                    }
                    return (that.CachedMediaEpisodes[query.mediaCategory][query.mediaId]);
                })
                .catch(function (err) {
                    console.log(err);
                });
        } else {
            return (this.CachedMediaEpisodes[query.mediaCategory][query.mediaId]);
        }
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
}