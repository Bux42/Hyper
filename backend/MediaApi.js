const rp = require('request-promise');

module.exports = class MediaApi {
    constructor() {
        this.CachedMedia = {};
    }
    async getMedia(query) {
        if (!this.CachedMedia[query.mediaCategory]) {
            var that = this;
            var url = "https://tv-v2.api-fetch.sh/" + query.mediaCategory + "/1?sort=trending&order=-1&genre=all";
            return await rp({uri: url})
            .then(function(response) {
                that.CachedMedia[query.mediaCategory] = JSON.parse(response);
                return (that.CachedMedia[query.mediaCategory]);
            })
            .catch(function (err) {
                console.log(err);
            });
        } else {
            return (this.CachedMedia[query.mediaCategory]);
        }
    }
}