var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */
// users
router.get('/', function(req, res, next) {
  var user_name = req.cookies.MY_USER;
  var session = req.session.logined;
  if (!session) {
    res.redirect('/')
  } else {
    request.post({
      url: 'http://localhost:5000/wallet/show/rest',
      headers: {
        "Content-Type": "application/json"
      },
      form: {
        'username': user_name
      }
    }, function (error, response, body) {
      var res_data = JSON.parse(body);
      if (!error && response.statusCode == 200) {
        if (res_data.rcode == 'ok') {
          console.log("-pri_key : ", res_data.rpri_key);
          console.log("-pub_key : ", res_data.rpub_key);
          res.render('users/users', {
            title: 'RealDesignTech',
            session: session,
            user_name: user_name,
            pri_key: res_data.rpri_key,
            pub_key: res_data.rpub_key
          });
        }
      }
    }
  )
}
});

module.exports = router;
