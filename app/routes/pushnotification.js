/**
 * Created by Admin on 5/30/16.
 */
var HttpStatus = require('http-status-codes');
var push=require('../models/OneSignalPush.js');

module.exports = function(router) {
    'use strict';
    router.route('/addnewdevices').post(function(req,res){
        push.addNewDevice(req.body,res);
    });

    router.route('/sendpush').post(function(req,res){

        push.sendNotification(req.body.account_id,req.body.account_id,req.body.typepush,res);

    });

}
