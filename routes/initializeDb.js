
var db = require('./dbconnect');


exports.createTables = function () {

    var sql1 = "CREATE TABLE IF NOT EXISTS operators" +
        "(id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, profile_picture VARCHAR(255) NOT NULL, proof VARCHAR(255) NOT NULL, name VARCHAR(100) NOT NULL," +
        "email VARCHAR(50) NOT NULL, mobile VARCHAR(50) NOT NULL," +
        "password VARCHAR(255) NOT NULL, operator_id VARCHAR(100), address VARCHAR(250) NOT NULL," +
        "customers TEXT NOT NULL, created_at VARCHAR(50) NOT NULL, modified_at VARCHAR(50) NOT NULL)";

    db.connection.query(sql1, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });

    var sql2 = "CREATE TABLE IF NOT EXISTS customers" +
        "(id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, profile_picture VARCHAR(255) NOT NULL, proof VARCHAR(255) NOT NULL, name VARCHAR(100) NOT NULL," +
        "email VARCHAR(50) NOT NULL, mobile VARCHAR(50) NOT NULL," +
        "password VARCHAR(255) NOT NULL, customer_id VARCHAR(100) NOT NULL, operator_id VARCHAR(100), address VARCHAR(250) NOT NULL," +
        "channels TEXT NOT NULL, created_at VARCHAR(50) NOT NULL, modified_at VARCHAR(50) NOT NULL)";


    db.connection.query(sql2, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
}