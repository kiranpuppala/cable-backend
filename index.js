var express = require("express");
var operator_auth = require('./routes/operator-signin-routes');
var customer_auth = require('./routes/customer-signin-routes');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var config = require('./config');

var app = express();
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var router = express.Router();

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  console.log("VERIFYTOKEN", req.headers['authorization'])
  if (typeof bearerHeader !== 'undefined') {
    jwt.verify(req.headers['authorization'], config.secretKey, (err, authData) => {
      if (err) {
        console.log("AUTHDATA", authData, err)
        res.send({
          code: 403,
          status: "Authorization failed",
          response: {}
        });
      } else {
        next();
      }
    });

  } else {
    res.send({
      code: 403,
      status: "Authorization failed",
      response: {}
    });
  }
}

router.get('/.well-known/assetlinks.json', function (req, res) {
  res.sendFile('assetlinks.json', { root: __dirname })
});

router.get('/', function (req, res) {
  res.sendFile('custom.html', { root: __dirname })
});


router.post('/operator-register', operator_auth.register);
router.post('/operator-login', operator_auth.login)
router.post('/customer-register', customer_auth.register);
router.post('/customer-login', customer_auth.login)


app.use('/', router);

app.listen(5000);
