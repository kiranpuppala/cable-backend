var bcrypt = require('bcrypt');
var db = require('./dbconnect');
var config = require('../config');
const jwt = require('jsonwebtoken');
const init = require('./initializeDb');


exports.register = function (req, res) {
  init.createTables();
  var today = new Date();
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    var users = {
      "profile_picture": req.body.profile_picture,
      "proof" : req.body.proof,
      "name": req.body.user_name,
      "email": req.body.email,
      "mobile": req.body.mobile,
      "password": hash,
      "customer_id": req.body.customer_id,
      "address": req.body.address,
      "channels": req.body.channels,
      "created_at": today,
      "modified_at": today
    }
    db.connection.query('INSERT INTO customers SET ?', users, function (error, results, fields) {
      if (error) {
        console.log("error ocurred", error);
        res.send({
          "code": 400,
          "status": "error querying",
          "response": {}
        })
      } else {
        console.log('The solution is: ', results);
        var email = req.body.email;
        var user_name = req.body.user_name;
        db.connection.query('SELECT id FROM customers WHERE email = ?', [email], function (error, results, fields) {
          if (results.length > 0) {
            const user = {
              id: results[0].id,
              username: user_name,
              email: email
            }
            jwt.sign({ user }, config.secretKey, { expiresIn: 60 * 60 }, (err, token) => {
              if (err) {
                res.send({
                  "code": 400,
                  "status": "error creating token",
                  "response": {}
                });
              } else {
                res.send({
                  "code": 200,
                  "status": "signup sucessful",
                  "response": {
                    "token": token
                  }
                });
              }
            });
          } else {
            resp.send({
              "code": 204,
              "status": "Email does not exits",
              "response": {}
            });
          }
        });
      }
    });
  });
}

exports.login = function (req, resp) {
  var email = req.body.email;
  var password = req.body.password;
  db.connection.query('SELECT * FROM customers WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      console.error(error)
      resp.send({
        "code": 400,
        "status": "error querying",
        "response": {}
      });
    } else {
      console.log("RESULTS", email)
      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, function (err, res) {
          if (res) {
            const user = {
              id: results[0].id,
              username: results[0].first_name,
              email: email
            }
            jwt.sign({ user }, config.secretKey, { expiresIn: 60 * 60 }, (err, token) => {
              resp.send({
                "code": 200,
                "status": "login sucessfull",
                "response": {
                  "token": token
                }
              });
            });
          } else {
            resp.send({
              "code": 404,
              "status": "Email and password does not match",
              "response": {}
            });
          }
        });
      }
      else {
        resp.send({
          "code": 204,
          "status": "Email does not exits",
          "response": {}
        });
      }
    }
  });
}
