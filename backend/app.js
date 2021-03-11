const express = require('express')
const session = require('express-session');
const cors = require('cors');

const app = express();
const port = 3000

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