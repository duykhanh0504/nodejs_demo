/**
 * Created by Admin on 6/22/16.
 */
var room=require('../models/room');
module.exports = function(router) {
    router.route('/receivermessagesuccess')
        .post(function(req,res){
            room.getrooms(req.body.account_id,res);
        });

    router.route('/updateroom').post(function(req,res)
    {
        room.updateroom(req.body,res);
    });

    router.route('/joinnewmember').post(function(req,res){

        room.joinroom(req.body.room_id,req.body.account_id,res);
    });

    router.route('/leftroom').post(function(req,res){
        room.leftroom(req.body.room_id,req.body.account_id,res);
    });

}