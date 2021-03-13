const express = require('express')
const session = require('express-session');
const cors = require('cors');
const MediaApi = require('./MediaApi');

const app = express();
const port = 3000;

const mediaApi = new MediaApi();

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
}))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

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
})