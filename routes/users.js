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

module.exports = router;
