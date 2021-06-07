const UserManager = require('../UserManager');
const express = require('express');
const router = express.Router();

const userManager = new UserManager();

router.get('/', (req, res, next) => {
    if (req.query.id) {
        userManager.getUser(req.query.id).then(result => {
            res.send(result);
        });
    } else {
        userManager.getUsers().then(result => {
            res.send(result);
        });
    }
});

router.use((req, res) => {
    res.send('Bad request to /users');
});

module.exports = router;