var express = require('express');
var router = express.Router();
var admindb = require('../database/adminbase')

var verifyAdminLogin = (req, res, next) => {
  if (req.session.admin) {
    next()
  }
  else {
    res.redirect('/admin/')
  }
}
/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.adminfalse) {
    res.render('./admin/login-page', { admin: true, err: "Incorrect Username Or Password" })
    req.session.adminfalse = false
  }
  else {
    res.render('./admin/login-page', { admin: true })
  }

});
router.get('/accept', verifyAdminLogin, (req, res) => {

  admindb.Show_Worker_Registration_Request().then((info) => {
    console.log(info);
    res.render('./admin/accept-list', { admin: true, info, admins: req.session.admin })
  })
})
router.post('/accept', verifyAdminLogin, async (req, res) => {
  console.log(req.body);
  await admindb.Accept_Worker_Registration(req.body).then((id) => {
    admindb.Remove_Worker_Registration(req.body.wkid).then((data) => {
      res.redirect('/admin/accept')
    })
  })
})
router.get('/rejaccept', verifyAdminLogin, (req, res) => {
  admindb.Remove_Worker_Registration(req.query.id).then((info) => {
    res.redirect('/admin/accept')
  })
})
router.post('/login', (req, res) => {
  console.log(req.body);
  admindb.Do_admIn_LogIn(req.body).then((info) => {
    if (info) {
      console.log("info = ", info);
      req.session.admin = info
      req.session.admin.adminstatus = true
      res.redirect('/admin/accept')
    }
    else {
      req.session.adminfalse = true
      res.redirect('/admin/')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.admin = null
  res.redirect('/admin/')
})
router.get('/workers', verifyAdminLogin, (req, res) => {
  admindb.Get_Workers_Details().then((list) => {
    console.log(list);
    res.render('./admin/workers-list', { admin: true, admins: req.session.admin, list })
  })
})
router.get('/wkremove', verifyAdminLogin, (req, res) => {
  admindb.Remove_Worker(req.query.wkid).then(() => {
    res.redirect('/admin/workers')
  })
})
router.get('/users', verifyAdminLogin, (req, res) => {
  admindb.Get_Users_Details().then((list) => {
    console.log(list);
    res.render('./admin/users-list', { admin: true, admins: req.session.admin, list })
  })
})
router.get('/userremove',verifyAdminLogin,(req,res)=>
{
  admindb.Remove_Users(req.query.id).then(() => {
    res.redirect('/admin/users')
  })
})
router.get('/activity',verifyAdminLogin,(req,res)=>
{
  admindb.Get_all_activites().then((act)=>
  {
    console.log(act);
    res.render('./admin/activity-page', { admin: true, admins: req.session.admin, list :act})
  })
})

module.exports = router;
