/**
 * Created by tuong on 4/8/16.
 */
var friends = require('../../app/models/friend');

module.exports = function(router) {

//example: http://locallhost:8080/api/example
    router.route('/')
        .get(function(req,res){
            friends.getAllFriend(res);
        });

};