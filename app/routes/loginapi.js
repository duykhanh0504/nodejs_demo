/**
 * Created by tuong on 3/21/16.
 */
var users = require('../../app/models/user');

//sign up
module.exports = function(router) {

//example: http://locallhost:8080/api/signup
    router.route('/')
        .post(function(req,res){
            users.loginWithAPI(req.body,res);
        });

};