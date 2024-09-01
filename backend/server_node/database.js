const mysql = require('mysql2');
require('dotenv').config();

const mysqlConnection = mysql.createConnection({
    host: process.env["DB_HOST"],
    user: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
    database: process.env["DB_SCHEMA"]
});

mysqlConnection.connect(function (err) {
    if(err){
        console.log(err);
        return;
    }else{
        console.log("Base de Datos conectada")
    }
});

module.exports = mysqlConnection;