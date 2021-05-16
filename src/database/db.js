const mysql2 = require("mysql2");
const dbConfig = require("../config/db.config.js");

var connection = mysql2.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  multipleStatements: true
});

module.exports = connection;