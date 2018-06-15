//var database = require('./database');

 var express = require('express');
 
 //var async = require('async');
 var logger = require('winston');
 
 var http = require('http');

//http.listen(process.env.PORT || 3000)

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

var io = require('socket.io').listen(server);

var listUser = [];

/*async.series([
  function initializeDBConnection(callback) {
    database.init();
    database.acquire(callback);
  }], function(err) {
    if (err) {
      logger.error('[APP] initialization failed', err);
    } else {
      logger.info('[APP] initialized SUCCESSFULLY');
    }
  }
);*/

io.on('connection', function(socket){
	console.log("an user connected!");
	logger.info('an user connected!');
	socket.on('user_login',function(username)
	{
			logger.info('an user connected!');
			console.log("an user connected!");
		if(listUser.indexOf(username) > -1)
		{
			return;
		}
		listUser.push(username);
		socket.user = username;
	});
	
	socket.on('send_messagee', function(msg){
		console.log(msg);
		io.emit('receive_message', msg);
	});
});

/*http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});*/