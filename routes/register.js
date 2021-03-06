var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
// register
router.get('/', function(req, res, next) {
  var user_name = req.cookies.MY_USER;
  var session = req.session.logined;
  if (session) {
    res.redirect('/')
  } else {
    res.render('register', {
      title: 'RealDesignTech',
      session: session,
      user_name: user_name
    });
  }
});

// request to python server
router.post('/', function(req, res) {
  var name = req.body.username;
  var password = req.body.password;

  request.post({
    // to function ?????
    url: 'http://localhost:5000/reg/rest',
    headers: {
      "Content-Type": "application/json"
    },
    // rest body x form o
    form: {
      'username': name,
      'password': password
    }
  }, function(error, response, body) {
    // res_data in body (rcode,rmessage)
    var res_data = JSON.parse(body);
    var session = req.session.logined;

    if (!error && response.statusCode == 200) {
      if (res_data.rcode == 'ok') {
        console.log("<--- log from : /reg");
        console.log("Register Success");
        console.log("-ID : ", name);
        console.log("-PW : ", password);
        res.redirect('/login');
      } else {
        console.log("<--- log from : /reg");
        console.log(res_data.rmessage);
        res.render('register', {
          title: res_data.rmessage,
          session : session
        });
      }
    } else if (error) {
      console.log(error);
      res.redirect('/reg');
    }
  });
})

module.exports = router;
