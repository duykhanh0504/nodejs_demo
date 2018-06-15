
var mysql = require('mysql');

function Connection() {
  this.pool = null;

  this.init = function() {
    this.pool = mysql.createPool({

      connectionLimit: 100,

       // host: '203.162.76.60',
       //  port: 3310,

      //server test
      host: '127.0.0.1',
      port: 3306,
        user: 'root',
        password: '',
		database: 'worldcafe',
        //real
        // password: 'tora29ttte',
       // database: 'WorldCafeDB',
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
