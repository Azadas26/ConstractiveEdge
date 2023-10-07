var express = require('express');
var router = express.Router();
var userdb = require('../database/userbase')


var verfylogin = (req, res, next) => {
  if (req.session.user) {
    next()
  }
  else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.user) {
    res.render('./user/first-page', { user: true, fuser: req.session.user });
  }
  else {
    res.render('./user/first-page', { user: true });
  }
});
router.get('/signup', (req, res) => {
  res.render('./user/signup-page', { user: true })
})
router.post('/signup', (req, res) => {
  console.log(req.body);
  userdb.Do_Signup_By_Users(req.body).then((id) => {
    res.redirect('/login')
  })
})
router.get('/login', (req, res) => {
  if (req.session.false) {
    res.render('./user/login-page', { user: true, err: "Incorrect Username or Password" })
    req.session.false = false
  }
  else {
    res.render('./user/login-page', { user: true })
  }
})

router.post('/login', (req, res) => {
  userdb.Do_Login_By_The_USer(req.body).then((info) => {
    if (info.state) {
      req.session.user = info.user
      req.session.user.state = true
      res.redirect('/')
    }
    else {
      console.log("Hello");
      req.session.false = true
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  console.log("Hello");
  req.session.user = null
  res.redirect('/login')
})
router.get('/services', verfylogin, (req, res) => {
  res.render('./user/services', { user: true, fuser: req.session.user })
})
router.post('/services', verfylogin, (req, res) => {
  userdb.FInd_Worker_By_THEUser(req.body).then((wks) => {
    res.render('./user/workers-list', { user: true, wks, fuser: req.session.user })
  })
})
router.get('/morewkinfo', (req, res) => {
  userdb.Individual_Worker_Info(req.query.id).then((info) => {
    userdb.Check_Wether_the_User_already_requestedORNot(req.session.user._id, req.query.id).then((infos)=>
   {
      if (infos.msg) {

        res.render('./user/worker-page', { user: true, fuser: req.session.user, info, msg:infos.msg })
      }
      else {
        res.render('./user/worker-page', { user: true, fuser: req.session.user, info })
      }
   })
  })
})
router.get('/request', (req, res) => {
  console.log(req.query);
  userdb.User_Send_request_TO_WorKEr(req.session.user._id, req.query.id,req.query.type).then((info) => { 
    res.redirect(`/morewkinfo?id=${info.wkid}`)
  })
})
router.get('/requests', verfylogin,(req, res) => {
  userdb.Get_List_OF_user_Requests(req.session.user._id).then((list)=>
  {
    res.render('./user/request-list', { user: true, fuser: req.session.user,list})
  })
})
router.get('/removereq',verfylogin,(req,res)=>
{
  userdb.Remove_WorkersUser_Request_By_user(req.session.user._id,req.query.wkid).then((data)=>
  {
    res.redirect('/requests')
  })
})

module.exports = router;
