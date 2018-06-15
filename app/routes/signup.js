/**
 * Created by tuong on 3/14/16.
 */
var users = require('../../app/models/user');
var util=require('../server/functionUtil.js');

//sign up
module.exports = function(router) {

//example: http://locallhost:8080/api/signup
    router.route('/')
        .post(function(req,res){
            req.body.create_date=util.getcurrenttime();
            users.create(req.body,res);
        });

};
