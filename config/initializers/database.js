// config/initializers/database.js
var mysql = require('mysql');

function Connection() {
  this.pool = null;

  this.init = function() {
    this.pool = mysql.createPool({

      connectionLimit: 100,

        host: '203.162.76.60',
         port: 3310,

      //server test
    //  host: '127.0.0.1',
    //  port: 3306,
        user: 'worldcafe',
        //password: 'kj1234',

        //real
         password: 'tora29ttte',
        database: 'WorldCafeDB',
          insecureAuth: true


    });
  };

  this.acquire = function(callback) {
    this.pool.getConnection(function(err, connection) {
      callback(err, connection);
    });
  };
}

module.exports = new Connection();
