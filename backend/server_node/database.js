const mysql = require("mysql2");
require("dotenv").config();

const mysqlConnection = mysql.createConnection({
  host: process.env["bdpractica1.cp842gwg2jsl.us-east-1.rds.amazonaws.com"],
  user: process.env["admin"],
  password: process.env["*Semi1_Practica1*"],
  database: process.env["Practica1_semi"],
});

mysqlConnection.connect(function (err) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Base de Datos conectada");
  }
});

module.exports = mysqlConnection;
