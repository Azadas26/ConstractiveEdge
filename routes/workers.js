var express = require('express');
var router = express.Router();
var workerdb = require('../database/workerbase');
const { log } = require('handlebars/runtime');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send("Hello workers")
});
router.get('/signup', (req, res) => {
    res.render('./workers/signup-page', { wk: true })
})
router.post('/signup', (req, res) => {
    workerdb.Do_Signup_By_WORKERUsers(req.body).then((id) => {

        res.redirect('/workers/signup')
    })
})
router.get('/login', (req, res) => {
    if (req.session.wkfalse) {
        res.render('./workers/login-page', { wk: true, err: "Incorrect Username or Password" })
        req.session.wkfalse = false
    }
    else {
        res.render('./workers/login-page', { wk: true })
    }

})
router.post('/login', (req, res) => {
    workerdb.Do_Login_By_The_Workers(req.body).then((info) => {
        if (info.state) {
            req.session.wkuser = info.user
            req.session.wkuser.state = true
            res.redirect('/workers')
        }
        else {
            req.session.wkfalse = true
            res.redirect('/workers/login')
        }
    })
})

module.exports = router;
