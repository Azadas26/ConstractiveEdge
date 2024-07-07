const express = require('express')
const router = express.Router() 

router.get('/',(req,res)=>
{
    res.render('./Firstpage/first-page')
})

module.exports = router;