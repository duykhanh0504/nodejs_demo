var changeCase = require('change-case');

var express = require('express');
var bodyParser = require('body-parser'); //connects bodyParsing middleware
var routes = require('require-dir')();

module.exports = function(app) {
  'use strict';



  // Initialize all routes
  Object.keys(routes).forEach(function(routeName) {
    var router = express.Router();
    // middleware to use for all requests
    router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
    });
    
    // Initialize the route to add its functionality to router
    require('./' + routeName)(router);
      require('./');
    
    // Add router to the speficied route name in the app
    app.use('/api/' + changeCase.paramCase(routeName), router);
  }); 
};


