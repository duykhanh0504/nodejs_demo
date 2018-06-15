/**
 * Created by tuong on 4/7/16.
 */
var connection = require('../../config/initializers/database');
var HttpStatus = require('http-status-codes');
async = require("async");
var push=require('../models/OneSignalPush');
var define=require('../server/defines');


function Friend() {
//get my friends
    this.getMyFriends = function (id,stt,res) {

        connection.acquire(function(err, con) {



            con.query('call App_getlistfriend(?,?) ', [id,stt],function(err,result){
                con.release();
                if(err)
                {
                    res.send({status: 3, message: 'getMyFriends is fail'});
                }else
                {
                    res.send({status: HttpStatus.OK,result:result[0],badgenumbers:result[0].length});
                }
            });


        });
    };

    this.cancelrequestfriend=function(body,res)
    {
        connection.acquire(function (err, con) {
            con.query('DELETE FROM Friend WHERE account_id=? AND friend_id=? AND STATUS=\'4\'',[body.friend_id,body.account_id], function (err, result) {
               con.release();
                if(err){
                    res.send({status: 3, message: 'Failed to delete status friend'});
                }else {
                    res.send({status: HttpStatus.OK, message: ' delete status friend successfully'});
                        push.sendNotification(body.friend_id,body.account_id,define.MessagePush.cancelrequestfriend+'');
                }

            });
        });
    };
    this.cancelsendrequestfriend=function(body,res)
    {
        connection.acquire(function (err, con) {
            con.query('DELETE FROM Friend WHERE account_id=? AND friend_id=? AND STATUS=\'4\'',[body.account_id,body.friend_id], function (err, result) {
                con.release();
                if(err){
                    res.send({status: 3, message: 'Failed to delete status friend'});
                }else {
                    res.send({status: HttpStatus.OK, message: ' delete status friend successfully'});
                }

            });
        });
    };
    this.acceptrequestfriend=function(body,res)
    {
        connection.acquire(function (err, con) {
            con.query('UPDATE Friend SET STATUS=\'1\' WHERE account_id=? AND friend_id=? and STATUS!=\'3\'',[body.friend_id,body.account_id], function (err, result) {
                con.release();
                if(err){
                    res.send({status: 3, message: 'Failed to delete status friend'});
                }else {
                        push.sendNotification(body.friend_id,body.account_id,define.MessagePush.acceptrequestfriend+'');
                    res.send({status: HttpStatus.OK, message: ' delete status friend successfully'});
                }

            });
        });
    };

    this.cancelbookmarkfriend=function(body,res)
    {
        connection.acquire(function (err, con) {
            con.query('DELETE FROM Friend WHERE account_id=? AND friend_id=? AND STATUS=\'3\'',[body.account_id,body.friend_id], function (err, result) {
               con.release();
                if(err){
                    res.send({status: 3, message: 'Failed to delete status friend'});
                }else {
                   // push.sendNotification(body.friend_id,define.TypePush.cancelrequestfriend);
                    res.send({status: HttpStatus.OK, message: ' delete status bookmark successfully'});

                }

            });
        });
    };

    this.getstatusfriend=function(body,res)
    {

        connection.acquire(function(err, con) {

            con.query('call App_getrelationship(?,?) ', [body.account_id,body.friend_id],function(err,result){
                con.release();
                if(err)
                {
                    res.send({status: 3, message: 'Failed to send request friend'});
                }else
                {
                    res.send({status: HttpStatus.OK, result: result[0]});
                }
            });

        });
    }

    // send request friend stt = 4
 this.sendrequestFriend = function (body,res) {
        if(body.account_id == "" || body.friend_id == "")
        {
            res.send({status: 2, message: 'acount_id or friend_id was null'});
        }else
        {
            connection.acquire(function(err, con) {

                con.query('call App_Sendrequestfriend(?,?) ', [body.account_id,body.friend_id],function(err,result){
                    con.release();
                    if(err)
                    {
                        res.send({status: 3, message: 'Failed to send request friend'});
                    }else
                    {

                        switch (result[0][0]['relationship'])
                        {

                            case 1:

                                    push.sendNotification(body.friend_id,body.account_id,define.MessagePush.acceptrequestfriend+'');
                                break;
                            case 4:
                                    push.sendNotification(body.friend_id,body.account_id,define.MessagePush.addfriend+'');
                                break;
                        }

                        res.send({status: HttpStatus.OK, result: result});
                    }
                });

            });
        }
    };

    // bookamrk user stt = 3
    this.bookmarkFriend = function (body,res) {
        if(body.account_id == "" || body.friend_id == "")
        {
            res.send({status: 2, message: 'acount_id or friend_id was null'});
        }else
        {
            body.status = 3;
            connection.acquire(function(err,con){
                con.query('insert into Friend set ?', body, function(err, result){
                    con.release();
                    if(err){
                        res.send({status: 3, message: 'Failed to bookamrk friend'});
                    }else {
                        res.send({status: HttpStatus.OK, message: 'Bookmark successfully'});
                    }
                });
            });
        }
    };
    // un friend
    this.unfriend = function (body,res) {
        connection.acquire(function(err,con){
            con.query('DELETE FROM Friend WHERE( (account_id = ? AND friend_id = ?) OR ( friend_id= ? AND  account_id = ?) )AND STATUS=\'1\'',[body.account_id,body.friend_id,body.account_id,body.friend_id], function(err, result){
                con.release();
                if(err){
                    res.send({status: 4, message: 'Failed to delete friend'});
                }else {
                    res.send({status: HttpStatus.OK, message: 'delete friend successfully'});

                }
            });
        });
    };
    // update status friend
    this.updateFriend = function (body,res) {

        connection.acquire(function(err, con) {
            con.query('update Friend set status=? where account_id = ? and friend_id = ?', [body.status,body.account_id, body.friend_id], function(err, result) {
                con.release();
                if (err) {
                    res.send({status: 5, message: 'Update failed'});
                } else {
                    res.send({status: HttpStatus.OK, message: 'Updated successfully'});
                }
            });
        });

    };
    //delete all friend
    this.deleteAllFriends = function( res) {
        connection.acquire(function(err, con) {
            con.query('delete from Friend', function(err, result) {
                con.release();
                if (err) {
                    res.send({status: 6, message: 'Failed to delete'});
                } else {
                    res.send({status: HttpStatus.OK, message: 'Deleted successfully'});
                }
            });
        });
    };
    //get all friends
    this.getAllFriend = function (res) {
        connection.acquire(function (err, con) {
            con.query('select * from Friend ', function (err, result) {
                con.release();
                if (err) {
                    res.send({status: 7, message: 'Failed to get'});
                } else {
                    res.send({status: HttpStatus.OK, result: result});
                }
            });
        });
    };

    this.getnearfriend=function(body,res)
    {
        connection.acquire(function(err, con) {

            con.query('call App_Getnearfriends(?) ', [body.account_id],function(err,result){
                con.release();
                if(err)
                {
                    res.send({status: 3, message: 'Failed to send request friend'});
                }else
                {
                    res.send({status: HttpStatus.OK, result: result[0]});
                }
            });

        });
    };


}
module.exports = new Friend();