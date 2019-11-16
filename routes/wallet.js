var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
// wallet_generate
// need to check session

router.get('/', function(req, res, next) {
  var user_name = req.cookies.MY_USER;
  var session = req.session.logined;
  if (!session) {
    res.redirect('/')
  } else {
    res.render('wallet_generate', {
      title: 'RDT wallet_generate'
    });
  }
});

router.get('/generate', function(req, res) {
  var user_name = req.cookies.MY_USER;
  var name = req.body.username;
  var password = req.body.password;

  request.get({
    url: 'http://localhost:5000/wallet/generate/rest',
    headers: {
      "Content-Type": "application/json"
    }
  }, function(error, response, body) {
    // response data
    var res_data = JSON.parse(body);
    if (!error && response.statusCode == 200) {
      if (res_data.rcode == 'ok') {
        console.log("<--- log from : /wallet/generate");
        console.log("Wallet generate Success");
        console.log("--pri_key : ", res_data.rpri_key);
        console.log("--pub_key : ", res_data.rpub_key);
        res.render('wallet_save', {
          title: 'success',
          pri_key: res_data.rpri_key,
          pub_key: res_data.rpub_key
        })
      } else {
        console.log("<--- log from : /wallet/generate");
        console.log("generate failed");
        res.render('wallet_generate', {
          title: 'fail'
        })
      }
    } else if (error) {
      console.log(error);
    }
  })
});

router.post('/save', function(req, res, next) {
  var name = req.cookies.MY_USER;
  var pri_key = req.body.pri_key;
  console.log('--save');
  console.log(pri_key);
  var pub_key = req.body.pub_key;
  request.post({
    url: 'http://localhost:5000/wallet/save/rest',
    headers: {
      "Content-Type": "application/json"
    },
    form: {
      'user_name': name,
      'pri_key': pri_key,
      'pub_key': pub_key
    }
  }, function(error, response, body) {
    // res_data in body (rcode,rmessage)
    var res_data = JSON.parse(body);
    if (!error && response.statusCode == 200) {
      if (res_data.rcode == 'ok') {
        console.log("<--- log from : /wallet/save");
        console.log("Wallet Save Success");
        console.log("-ID : ", name);
        console.log("-pri_key : ", pri_key);
        console.log("-pub_key : ", pub_key);
        // change to show
        res.redirect('/');
      } else {
        console.log("<--- log from : /wallet/save");
        console.log("FAIL");
      }
    } else if (error) {
      console.log(error);
      res.redirect('/save');
    }
  })
  // res.redirect('/')
});

router.get('/show', function(req, res, next) {
  var user_name = req.cookies.MY_USER;

  request.post({
    url: 'http://localhost:5000/wallet/show/rest',
    headers: {
      "Content-Type": "application/json"
    },
    form: {
      'username': user_name
    }
  }, function(error, response, body) {
    // res_data in body (rcode,rmessage)
    var res_data = JSON.parse(body);
    if (!error && response.statusCode == 200) {
      if (res_data.rcode == 'ok') {
        console.log(res_data);
        console.log("<--- log from : /wallet/show");
        console.log("Wallet Show Success");
        console.log("-ID : ", user_name);
        console.log("-pri_key : ", res_data.rpri_key);
        console.log("-pub_key : ", res_data.rpub_key);
        // change to show
        res.render('wallet_show', {
          title: user_name,
          pri_key: res_data.rpri_key,
          pub_key: res_data.rpub_key
        });
      } else {
        console.log("<--- log from : /wallet/show");
        console.log("FAIL");
      }
    } else if (error) {
      console.log(error);
      res.redirect('/save');
    }
  })

  // if (req.session.logined == false) {
  //   res.redirect('/')
  // } else {
  //   res.render('wallet_generate', {
  //     title: 'RDT wallet_generate'
  //   });
  // }
});


module.exports = router;
