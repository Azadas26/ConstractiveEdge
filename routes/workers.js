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
        workerdb.Check_Workers_status(req.session.wkuser.wkid).then((onoff) => {
            res.render('./workers/first-page', { wk: true, wuser: req.session.wkuser,onoff})
        })
    }
    else {
        res.render('./workers/first-page', { wk: true })
    }

});
router.post('/setstatus', verfyawklogin, (req, res) => {
    if (req.body.status === 'true') {
        workerdb.Change_Workers_Working_Status(req.session.wkuser.wkid, true).then((data) => {
            res.redirect('/workers')
        })
    }
    else {
        workerdb.Change_Workers_Working_Status(req.session.wkuser.wkid, false).then((data) => {
            res.redirect('/workers')
        })
    }
})
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
router.get('/confirm', verfyawklogin, async (req, res) => {
    await workerdb.Get_Request_from_users(req.session.wkuser.wkid).then((list) => {
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
    await workerdb.Confirm_User_Request_By_WorkER(req.query.id, req.session.wkuser.wkid, req.query.type).then((info) => {
        workerdb.Change_acc_By_Worker(req.query.id, req.session.wkuser.wkid).then((data) => {
            res.redirect('/workers/confirm')
        })
    })
})
router.get('/workes', verfyawklogin, (req, res) => {
    workerdb.Get_Current_workes(req.session.wkuser.wkid).then((list) => {
        console.log(list);
        res.render('./workers/your-workes', { wk: true, wuser: req.session.wkuser, list })
    })
})
router.get('/endwrk', verfyawklogin, (req, res) => {
    workerdb.Update_Work_By_worker(req.query.id, req.session.wkuser.wkid).then((data) => {
        res.redirect('/workers/workes')
    })
})
router.get('/update',verfyawklogin,(req,res)=>
{
    res.render('./workers/update-profile', { wk: true, wuser: req.session.wkuser })
})
router.post('/update',verfyawklogin,(req,res)=>
{
    req.body.wkid = req.session.wkuser.wkid
    workerdb.Update_Workers_profile(req.body).then(async(id)=>
    {
        var img1 = req.files.image1
        var img2 = req.files.image2
        var img3 = req.files.image3
        if(img1)
        {
            await img1.mv("public/update-profile/" + id + "1.jpg", (err, data) => {
                if (err) {
                    console.log(err);
                }
            })
        }
        if (img2) {
            await img2.mv("public/update-profile/" + id + "2.jpg", (err, data) => {
                if (err) {
                    console.log(err);
                }
            })
        }
        if (img3) {
            await img3.mv("public/update-profile/" + id + "3.jpg", (err, data) => {
                if (err) {
                    console.log(err);
                }
            })
        }
        res.redirect('/workers')
    })
})

module.exports = router;