var express = require('express');
var router = express.Router();
var workerdb = require('../database/workerbase');
const { log } = require('handlebars/runtime');
const { userbase } = require('../connection/constants');

var verfyawklogin = (req, res, next) => {
    if (req.session.wkuser) {
        next()
    }
    else {
        res.redirect('/workers/login')
    }
}
/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.session.wkuser) {
        res.render('./workers/first-page', { wk: true, wuser: req.session.wkuser })
    }
    else {
        res.render('./workers/first-page', { wk: true })
    }

});
router.get('/signup', (req, res) => {
    res.render('./workers/signup-page', { wk: true })
})
router.post('/signup', (req, res) => {
    console.log(req.body);
    workerdb.Do_Signup_By_WORKERUsers(req.body).then(async (id) => {

        res.redirect('/workers/login')
        var image = req.files.image
        if (image) {
            await image.mv("public/workersimage/" + id + ".jpg", (err, data) => {
                if (err) {
                    console.log(err);
                }
            })
        }
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
router.get('/logout', (req, res) => {
    req.session.wkuser = null
    res.redirect('/workers/login')
})
router.get('/confirm', verfyawklogin, async(req, res) => {
  await  workerdb.Get_Request_from_users(req.session.wkuser.wkid).then((list) => {
        console.log(list);
        res.render('./workers/request-list', { wk: true, wuser: req.session.wkuser, list })
    })
})
router.get('/reject', (req, res) => {
    workerdb.Reject_Request_From_UseR(req.query.id, req.session.wkuser.wkid).then((data) => {
        res.redirect('/workers/confirm')
    })
})
router.get('/accept', async (req, res) => {
    await workerdb.Confirm_User_Request_By_WorkER(req.query.id, req.session.wkuser.wkid,req.query.type).then((info) => {
        workerdb.Change_acc_By_Worker(req.query.id, req.session.wkuser.wkid).then((data) => {
            res.redirect('/workers/confirm')
        })
    })
})

module.exports = router;