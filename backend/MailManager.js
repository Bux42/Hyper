require('dotenv').config()

const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = class UserManager {
    constructor() {
        this.GmailUsername = process.env.GmailUsername;
        this.GmailPassword = process.env.GmailPassword;
    }
    async sendPasswordRecovery(email, db) {
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: this.GmailUsername,
                pass: this.GmailPassword
            }
        });
        const collection = db.collection('users');
        collection.find({
            email: email
        }).toArray(function (err, docs) {
            if (docs.length > 0) {
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(email, salt, function (err, hash) {
                        docs[0]["emailRecoverySecret"] = hash;
                        collection.update({
                            id: docs[0].id,
                        }, docs[0]);
                        transporter.sendMail({
                            from: '"Hypertube" <hypertube@42.from>',
                            to: email,
                            subject: 'Hypertube password recovery',
                            text: 'Your secret code is: ' + hash
                        });
                    });
                });
            }
        });
    }
}