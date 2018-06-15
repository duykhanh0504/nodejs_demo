/**
 * Created by Admin on 6/1/16.
 */
var connection = require('../../config/initializers/database');
var HttpStatus = require('http-status-codes');
var functionutil=require('../server/functionUtil');
var defines=require('../server/defines');
var push=require('../models/OneSignalPush.js');
function newfeed()
{
    this.addnewfeed=function(body,callback)
    {
        var day=functionutil.getcurrenttime();
        connection.acquire(function(err,con){
                con.query('Call App_Insert_Newfeed(?,?,?)',[body.description,day,body.account_id],
                    function(err,result){
                        con.release();
                        if(err)
                        {
                            console.log("insert newfeed is fail: "+err);
                            callback(-1);
                        }else
                        {
                            var id= result[0][0].newfeed_id;
                            console.log("insert newfeed is success: "+id);
                            callback(id);
                        }
                    }
                );
            }
        );
    };

    this.getnewfeed=function(body,res)
    {
        connection.acquire(function(err,con){
               var offset=20;

                con.query('Call App_SelectNewfeeds_Friend(?,?,?)',[body.account_id,body.index*offset,offset],
                    function(err,result){
                        con.release();
                        if(err)
                        {
                            res.send({status: -1,result:err});
                        }else
                        {
                            res.send({status: HttpStatus.OK,result:result});
                        }
                    }
                );
            }
        );
    };

    this.getnewfeed_nearfriend=function(body,res)
    {
        connection.acquire(function(err,con){
                var offset=20;
                con.query('Call App_SelectNewfeeds_NearFriend(?,?,?)',[body.account_id,body.index*offset,offset],
                    function(err,result){
                        con.release();
                        if(err)
                        {
                            res.send({status: -1,result:err});
                        }else
                        {
                            res.send({status: HttpStatus.OK,result:result});
                        }
                    }
                );
            }
        );
    };


    this.likenewfeed=function(body,res)
    {
        var day=functionutil.getcurrenttime();
        connection.acquire(function(err,con){
                con.query('Call App_LikeNewfeed(?,?,?)',[body.newfeed_id,body.account_id,day],
                    function(err,result){
                        con.release();
                        if(err)
                        {
                            res.send({status: -1});
                        }else
                        {
                            console.log('likeeeeeeeeeeeeeeee: %',result[0][0]['account_id']);

                            if(result[0][0]['v_count']==0){
                                var more
                                    push.sendNotification(result[0][0]['account_id']+'',body.account_id,defines.MessagePush.user_like_timeline+'');
                            }
                            res.send({status: HttpStatus.OK});
                        }
                    }
                );
            }
        );
    };


    this.getuserlikenewfeed=function(body,res)
    {
        connection.acquire(function(err,con){
                con.query('Call App_GetUserLike(?,?)',[body.newfeed_id,body.account_id],
                    function(err,result){
                        con.release();
                        if(err)
                        {
                            res.send({status: -1});
                        }else
                        {

                            res.send({status: HttpStatus.OK,result:result});
                        }
                    }
                );
            }
        );
    };

    this.getcommentnewfeed=function(body,res)
    {
        connection.acquire(function(err,con){
                con.query('Call App_GetComment(?)',[body.newfeed_id],
                    function(err,result){
                        con.release();
                        if(err)
                        {
                            res.send({status: -1});
                        }else
                        {
                            res.send({status: HttpStatus.OK,result:result});
                        }
                    }
                );
            }
        );
    };

    this.postcomment=function(body,res)
    {
        connection.acquire(function(err,con){
                var day=functionutil.getcurrenttime();
                con.query('Call App_PostComment(?,?,?,?)',[body.newfeed_id,body.account_id,day,body.content],
                    function(err,result){
                        con.release();
                        if(err)
                        {
                            res.send({status: -1+err});
                        }else
                        {

                                push.sendNotification(result[0][0]['account_id'],body.account_id,defines.MessagePush.user_comment_timeline+'');
                            res.send({status: HttpStatus.OK});
                        }
                    }
                );
            }
        );
    };

    this.deletenewfeed=function(body,res){
        connection.acquire(function(err,con){
                var day=functionutil.getcurrenttime();
                con.query('Call App_DeleteNewFeed(?,?)',[body.newfeed_id,day],
                    function(err,result){
                        con.release();
                        if(err)
                        {
                            res.send({status: -1+err});
                        }else
                        {


                            res.send({status: HttpStatus.OK});
                        }
                    }
                );
            }
        );
    };
    this.updatenewfeed=function(body,res){
        connection.acquire(function(err,con){
                var day=functionutil.getcurrenttime();
                con.query('Call App_EditNewFeed(?,?,?)',[body.newfeed_id,body.description,day],
                    function(err,result){
                        con.release();
                        if(err)
                        {
                            res.send({status: -1+err});
                        }else
                        {


                            res.send({status: HttpStatus.OK});
                        }
                    }
                );
            }
        );
    };



}

module.exports = new newfeed();