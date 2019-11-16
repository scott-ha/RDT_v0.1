var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
// register
router.get('/', function(req, res, next) {
  var session = req.session.logined;
  if (!session) {
    res.redirect('/')
  } else {
    res.render('unregister', { title: 'RealDesignTech' });
  }
});

// request to python server
router.post('/', function (req, res) {
  var name = req.body.username;
  var password = req.body.password;

  request.post({
    // to function ?????
    url: 'http://localhost:5000/unreg/rest',
    headers: {
      "Content-Type": "application/json"
    },
    // rest body x form o
    form: {
      'username' : name,
      'password' : password
    }
  }, function (error, response, body) {
    // res_data in body (rcode,rmessage)
    var res_data = JSON.parse(body);

    if(!error && response.statusCode == 200) {
      if(res_data.rcode == 'ok') {
        console.log("<--- log from : /unreg");
        console.log("unRegister Success");

        // set session logined = false
        // clear cookies
        res.redirect('/logout');
      } else {
        console.log("<--- log from : /unreg");
        console.log(res_data.rmessage);
        res.render('unregister', {title: res_data.rmessage});
      }
    } else if (error) {
      console.log(error);
      res.redirect('/unreg');
    }
  });
})

module.exports = router;
