var express = require('express');
var router = express.Router();

// var user;
/* GET home page. */
router.get('/', function(req, res, next) {
  // cookie from req.headers.cookie
  var user_name = req.headers.cookie;
  var session = req.headers.session;
  if(!session) {

  }
  res.render('intro/company', { title: 'RDT' });
});

module.exports = router;
