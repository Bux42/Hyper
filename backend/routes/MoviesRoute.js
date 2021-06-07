const MediaApi = require('../MediaApi');
const express = require('express');
const router = express.Router();

const mediaApi = new MediaApi();

router.get('/', (req, res, next) => {
    mediaApi.getMedia({
        "mediaCategory": "movies",
        "page": 1,
        "genre": "all",
        "keywords": "",
        "filter": "trending"
    }).then(result => {
        var cleanRes = [];
        result.forEach(res => {
            cleanRes.push({
                "id": res.imdb_id,
                "name": res.title
            });
        })
        res.send(cleanRes);
    });
});

router.use((req, res) => {
    res.send('Bad request to /movies');
});

module.exports = router;