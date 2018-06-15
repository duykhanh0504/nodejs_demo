/**
 * Created by DieuNguyen on 4/22/16.
 */
var connection = require('../../config/initializers/database');
var HttpStatus = require('http-status-codes');
async = require("async");
var dateFormat = require('dateformat');
function message()
{
    this.addmessage = function(message,callback)
    {
            connection.acquire(function(err,con){
                    con.query('Call App_insertmessage(?,?,?,?,?,?,?)',[message.message.message,message.from_account_id,message.to_account_ids,message.create_date,message.room_id,',',message.message.type],
                        function(err,result){
                            con.release();
                            if(err)
                            {
                                //console.log("Failed to send message: "+err);
                                callback(-1);
                            }else
                            {
                                var id= result[0][0].message_id;
                                //console.log("success to send message: "+id);
                                callback(id);
                            }
                        });
                }
            );
    };
    this.updatereceivemessage=function(req,res)
    {
        console.log("App_updatereceivemessage: "+req.body.message_id);
        connection.acquire(function(err,con){
                var date = new Date();
                var day=dateFormat(date, "yyyy-mm-dd h:MM:ss");
                var mess_id=req.body.message_id;
                var reciever_account=req.body.account_id;

                console.log("message id=  "+mess_id);
                con.query('CALL App_update_receive_messages(?,?,?)',[mess_id,reciever_account,day],function(arr,result){
                        con.release();
                        if(err)
                        {
                            //console.log("Failed to update message: "+err);
                            res.send({ status:1,result:'Failed to update message'});
                        }else
                        {
                            //console.log("success to update message: "+mess_id);
                            res.send({ status:HttpStatus.OK,result:result });
                        }
                    }
                );
            }
        );
    };

    this.updatereceivemessages=function(req,res)
    {
        connection.acquire(function(err,con){
                var date = new Date();
                var day=dateFormat(date, "yyyy-mm-dd h:MM:ss");
                var mess_ids=req.body.message_id;
                var reciever_account=req.body.account_id;

                con.query('CALL App_update_receive_messages(?,?,?)',[mess_ids,reciever_account,day],function(arr,result)
                {
                    con.release();
                    if(err)
                    {
                       // console.log("Failed to update message: "+err);
                        res.send({ status:1,result:'Failed to update message'});
                    }else
                    {
                        //console.log("success to update message: ");
                        res.send({ status:HttpStatus.OK,result:result });
                    }
                });
            }
        );
    };

    this.getofflinemeesage=function(account_id,friend_id,res)
    {
        connection.acquire(function(err,con){
            con.query('CALL App_getofflinemeesage(?,?)',[account_id,friend_id],function(arr,result)
            {
                con.release();
                if(err)
                {
                    res.send({ status:1,result:'getofflinemeesage'});
                }else
                {
                    res.send({ status:HttpStatus.OK,result:result });
                }
            });
        });
    };


    this.getgroupOfflinemessage=function(account_id,room_id,res){
        connection.acquire(function(err,con){
            con.query('CALL App_getgroupofflinemeesage1_2(?,?)',[account_id,room_id],function(arr,result)
            {
                con.release();
                if(err)
                {
                    res.send({ status:1,result:'getofflinemeesage'});
                }else
                {
                    res.send({ status:HttpStatus.OK,result:result });
                }
            });
        });
    };

    this.getoffline_groupmess=function(account_id,res)
    {
        connection.acquire(function(err,con){
            con.query('CALL App_getoffline_groupmess(?)',[account_id],function(arr,result)
            {
                con.release();
                if(err)
                {
                    res.send({ status:1,result:'getoffline_groupmess fail'});
                }else
                {
                    res.send({ status:HttpStatus.OK,result:result });
                }
            });
        });
    };

    this.getoffline_fiendmess=function(account_id,res)
    {
        connection.acquire(function(err,con){
            con.query('CALL App_getfriend_offlinemeesage(?)',[account_id],function(err,result)
            {
                con.release();
                if(err)
                {
                    res.send({ status:1,result:'getoffline_fiendmess fail: '+err});
                }else
                {
                    res.send({ status:HttpStatus.OK,result:result });
                }
            });
        });
    };

    this.getoffline_unfiendmess=function(account_id,res)
    {
        connection.acquire(function(err,con){
            con.query('CALL App_getunfriend_offlinemeesage(?)',[account_id],function(err,result)
            {
                con.release();

                if(err)
                {
                    res.send({ status:1,result:'getoffline_fiendmess fail: '+err});
                }else
                {
                    res.send({ status:HttpStatus.OK,result:result });

                }
            });
        });
    };
}
module.exports = new message();