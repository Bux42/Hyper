const UserManager = require('../UserManager');
const express = require('express');
const router = express.Router();

const {
    OAuth2Client
} = require('google-auth-library');
const userManager = new UserManager();

const CLIENT_ID = '330877404089-fv092abq9a4dnsfa1p93mb98ppdjpe7a.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

function verify(token) {
    return (new Promise(resolve => {
        const ticket = client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        resolve(ticket);
    }));
}

router.post('/oauth', (req, res, next) => {
    delete req.session.user;
    if (req.body.form) {
        if (req.body.form.AccountType == 'Google') {
            verify(req.body.form.Data.qc.id_token)
                .then(result => {
                    userManager.getGoogleAccount({
                        "body": {
                            "UserData": {
                                "NT": result.payload.sub,
                                "xV": result.payload.given_name,
                                "sT": result.payload.family_name,
                                "ou": result.payload.email,
                                "uK": result.payload.picture,
                            }
                        }
                    }).then(googleAccount => {
                        userManager.createUserInfos("Google", googleAccount).then(acc => {
                            req.session.user = acc;
                            res.send({
                                "Error": null,
                                "Account": acc
                            });
                        });
                    })
                })
                .catch(err => {
                    res.send({
                        "Account": null,
                        "Error": "Invalid oauth token"
                    });
                });
        }
        else if (req.body.form.AccountType == 'School') {
            userManager.checkSchoolLogin(req.body.form.Code).then(result => {
                if (!result.Error) {
                    userManager.createUserInfos("School", result.Account).then(acc => {
                        req.session.user = acc;
                        res.send({
                            "Error": null,
                            "Account": acc
                        });
                    });
                } else {
                    res.send(result);
                }
            });
        }
    } else {
        res.send({
            "Account": null,
            "Error": "Invalid post request"
        });
    }
});

router.get('/session', (req, res, next) => {
    res.send({
        "userSession": req.session.user
    });
});

router.use((req, res) => {
    res.send('Bad request to /auth');
});

module.exports = router;