// config/initializers/server.js

var express = require('express');
var path = require('path');
// Local dependecies
var config = require('nconf');

// create the express app
// configure middlewares
var bodyParser = require('body-parser');
var morgan = require('morgan');
var logger = require('winston');
var app=express();
var server= require('http').Server(app);


var client = require("../../app/server/client");
var defines = require("../../app/server/defines");


var io = require('socket.io')(server);
var mapPlayerByMemberId = [];

var uitl=require('../../app/server/functionUtil');

var fs =require('fs-extra');

var localizePush = require('../../app/models/LocalizePushNotification');
var localizeData = [];

var start =  function(cb) {
  'use strict';
  // Configure express
//  app = express();

    mapPlayerByMemberId.length=0;

  app.use(morgan('common'));
  app.use(bodyParser.json({limit: '100mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  //app.use(express.static(__dirname + '/public'));

  logger.info('[SERVER] Initializing routes');
    uitl.getcurrenttime();
  //for API
  require('../../app/routes/index')(app);

  //for test API
//  require('../../app/routestest/index')(app);

  //app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static('public'));

//  require('../../app/server/gameserver')(io);

    io.on('connection', function (socket) {
        //moi connect xu ly = 1 client
        console.log('========connect socket');
        new client.Client(socket,io);
    });

    io.on('error',function(err)
    {
        logger.error(err);
    });


  // Error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: (app.get('env') === 'development' ? err : {})
    });
    next(err);
  });

  server.listen(config.get('NODE_PORT_LOCAL'));
  logger.info('[SERVER] Listening on port ' + config.get('NODE_PORT_LOCAL'));

    localizePush.ReadLocalize(function (callback) {
        localizeData = callback;
    });

  if (cb) {
    return cb();
  }
};



 exports.getFromList = function(id)
{
    if(id>=mapPlayerByMemberId.length)
        return null;
    return mapPlayerByMemberId[id];
};
exports.addToList = function(id, client)
{
   if(checkExist(id))
   {
       console.log('addtolist===========================da ton tai');
   }else
   {
       mapPlayerByMemberId[id] = client;
   }



//    for(var i=0;i<mapPlayerByMemberId.length;i++)
//    {
//        if(mapPlayerByMemberId[i]!=null)
//        console.log("socket+++++addtolist+++++++++++++++++++++++++:%",mapPlayerByMemberId[i]);
//
//    }
};


exports.showList =function()
{
        for(var i=0;i<mapPlayerByMemberId.length;i++)
    {
        if(mapPlayerByMemberId[i]!=null)
        console.log("socket+++++showList+++++++++++++++++++++++++:%",mapPlayerByMemberId[i]);

    }
};

exports.removeFromList = function(id)
{

    console.log('=================remove list========================='+id);
    mapPlayerByMemberId[id]=null;



};

var checkExist=exports.checkExist = function(id)
{
    if(mapPlayerByMemberId==null)
    return false;
    if(mapPlayerByMemberId[id]!=null)
        return true;
    return false;
//    return mapPlayerByMemberId.hasOwnProperty(id);
};

exports.localizeData = function () {

return localizeData;
};

module.exports = start;
