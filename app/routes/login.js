/**
 * Created by tuong on 3/15/16.
 */
var users = require('../../app/models/user');
var connection = require('../../config/initializers/database');
var HttpStatus = require('http-status-codes');

var client =require('../server/client.js');

var util=require('../server/functionUtil.js');


//
module.exports = function(router) {

//example: http://locallhost:8080/api/login
    router.route('/')
        .post(function(req,res){

            users.onLogin(req.body,res);
        });

    router.route('/non_pass')
        .post(function(req,res){
            users.onLogin_NonPassWord(req.body,res);
        });


    /// this function for test
    /// get all info from Login table
    router.route('/all')
        .get(function(req,res){

            connection.acquire(function(err, con) {
                con.query('select * from Login', function(err, result) {
                    con.release();
                    if (err) {
                        res.send({status: 1, message: 'Failed to get'});
                    } else {
                        res.send({status: HttpStatus.OK,result:result});
                    }
                });
            });
        });

};
