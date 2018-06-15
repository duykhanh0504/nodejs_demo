/**
 * Created by DieuNguyen on 4/22/16.
 */
var message = require('../../app/models/message');
var user=require('../models/user');
var math = require('mathjs');
var connection = require('../../config/initializers/database');
var HttpStatus = require('http-status-codes');
async = require("async");
module.exports = function(router) {

//example: http://locallhost:8080/api/friend
    router.route('/receivermessagesuccess')
        .post(function(req,res){
           message.updatereceivemessage(req,res);
        });
    router.route('/receivermessagessuccess')
        .post(function(req,res){
            message.updatereceivemessages(req,res);
        });

    router.route('/getoffline_friendmess')
        .post(function(req,res){

            message.getoffline_fiendmess(req.body.account_id,res);
        });

    router.route('/getoffline_unfriendmess')
        .post(function(req,res){

            message.getoffline_unfiendmess(req.body.account_id,res);
        });

    router.route('/getoffline_groupmess')
        .post(function(req,res){
            message.getoffline_groupmess(req.body.account_id,res);
        });

    router.route('/getofflinemessage')
        .post(function(req,res){
            message.getofflinemeesage(req.body.account_id,req.body.friend_id,res)
        });


    router.route('/getgroupofflinemessage').post(function(req,res){
        message.getgroupOfflinemessage(req.body.account_id,req.body.room_id,res);
    });

}

