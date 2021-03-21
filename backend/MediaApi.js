const rp = require('request-promise');

module.exports = class MediaApi {
    constructor() {
        this.MalImgs = {};
        this.CachedMedia = {};
        this.CachedMediaEpisodes = {};
    }
    async getMedia(query) {
        var that = this;
        var url = "https://tv-v2.api-fetch.sh/" + query.mediaCategory + "/" + query.page + "?sort=trending&order=-1&genre=all";
        return await rp({
                uri: url
            })
            .then(function (response) {
                that.CachedMedia[query.mediaCategory] = JSON.parse(response);
                if (query.mediaCategory == "animes") {
                    that.CachedMedia[query.mediaCategory].forEach(element => {
                        if (that.MalImgs[element.mal_id]) {
                            element.images.banner = that.MalImgs[element.mal_id];
                        }
                    });
                }
                return (that.CachedMedia[query.mediaCategory]);
            })
            .catch(function (err) {
                console.log(err);
            });
        /*
        if (!this.CachedMedia[query.mediaCategory]) {
            var that = this;
            var url = "https://tv-v2.api-fetch.sh/" + query.mediaCategory + "/" + query.page + "?sort=trending&order=-1&genre=all";
            return await rp({
                    uri: url
                })
                .then(function (response) {
                    that.CachedMedia[query.mediaCategory] = JSON.parse(response);
                    if (query.mediaCategory == "animes") {
                        that.CachedMedia[query.mediaCategory].forEach(element => {
                            if (that.MalImgs[element.mal_id]) {
                                element.images.banner = that.MalImgs[element.mal_id];
                            }
                        });
                    }
                    return (that.CachedMedia[query.mediaCategory]);
                })
                .catch(function (err) {
                    console.log(err);
                });
        } else {
            return (this.CachedMedia[query.mediaCategory]);
        }*/
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