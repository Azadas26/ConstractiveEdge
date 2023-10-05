var express = require('express');
var router = express.Router();
var admindb = require('../database/adminbase')

/* GET users listing. */
router.get('/', function(req, res, next) {
  
});
router.get('/accept',(req,res)=>
{
  
    admindb.Show_Worker_Registration_Request().then((info)=>
    {
      console.log(info);
       res.render('./admin/accept-list',{admin:true,info})
    })
})
router.post('/accept',async(req,res)=>
{
  console.log(req.body);
 await admindb.Accept_Worker_Registration(req.body).then((id) => {
    admindb.Remove_Worker_Registration(req.body.wkid).then((data)=>
    {
      res.redirect('/admin/accept')
    })
  })
})
router.get('/rejaccept',(req,res)=>
{
  admindb.Remove_Worker_Registration(req.query.id).then((info)=>
  {
    res.redirect('/admin/accept')
  })
})

module.exports = router;
