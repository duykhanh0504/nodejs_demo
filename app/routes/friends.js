/**
 * Created by tuong on 4/14/16.
 */
var friends = require('../../app/models/friend');
var user=require('../models/user');
var math = require('mathjs');
var connection = require('../../config/initializers/database');
var HttpStatus = require('http-status-codes');
async = require("async");



module.exports = function(router) {

//example: http://locallhost:8080/api/friend
    router.route('/sendrequest')
        .post(function(req,res){
            friends.sendrequestFriend(req.body,res);
        });
    //example: http://locallhost:8080/api/friend/getfriends
    router.route('/getfriends/')
        .get(function(req,res){

            friends.getMyFriends(req.query.account_id,req.query.status_id,res);
        });


    //example: http://locallhost:8080/api/unfriend
    router.route('/unfriend')
        .post(function(req,res){
            friends.unfriend(req.body,res);
        });
    //example: http://locallhost:8080/api/updatefriend
    router.route('/updatefriend')
        .post(function(req,res){
            friends.updateFriend(req.body,res);
        });

    router.route('/getAllAccounts')
        .get(function(req, res) {

            return user.getAll(res);

        })

    router.route('/bookmarkFriend').post(function(req,res){
        friends.bookmarkFriend(req.body,res);
    });

    router.route('/cancelbookmarkfriend').post(function(req,res){
        friends.cancelbookmarkfriend(req.body,res);
    });
    
    router.route('/getstatusfriend').post(function(req,res){
        friends.getstatusfriend(req.body,res);
    });

    router.route('/cancelsendrequestfriend').post(function(req,res){
        friends.cancelsendrequestfriend(req.body,res);
    });

    router.route('/cancelrequestfriend').post(function(req,res){
        friends.cancelrequestfriend(req.body,res);
    });

    router.route('/acceptrequestfriend').post(function(req,res){
        friends.acceptrequestfriend(req.body,res);
    });

    router.route('/searchnearfriens')
        .post(function(req, res) {
        friends.getnearfriend(req.body,res);
     });

};