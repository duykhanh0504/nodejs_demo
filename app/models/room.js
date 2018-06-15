/**
 * Created by Dieu Nguyen on 4/22/16.
 */

var connection = require('../../config/initializers/database');
var HttpStatus = require('http-status-codes');
async = require("async");
var Util=require('../server/functionUtil');
var roommodule=require('../modules/roommodule');

function Room()
{
    this.newroom= function(room,callback)
    {
        var date=Util.getcurrenttime();

        connection.acquire(function(err,con){
            con.query('CALL App_createroom(?,?,?,?)',[room.roomname,date,room.account_id_create,room.avarta],function(err,rows){
                con.release();
                if(err)
                {
                    console.log('create room: '+err);
                }else
                {
//                  joinroom(rows[0][0].room_id,account_id_create);
                    callback(rows[0][0].room_id);
                }
            });
            //con.release();
        });
    };

    this.updateroom=function(room,res){
        connection.acquire(function(err,con){
            con.query('CALL App_updateroom(?,?,?)',[room.roomname,room.avarta,room.id],function(err,rows){
                con.release();
                if(err)
                {
                    res.send({ status:-1});
                }else
                {
                    res.send({ status:HttpStatus.OK});
                }
            });
            //con.release();
        });
    };

  this.joinroom= function (room_id,account_id_join,res)
    {

        var date=Util.getcurrenttime();



        connection.acquire(function(err,con){
            con.query('INSERT INTO Room_Account (room_id,account_id,jointime) VALUES (?,?,?)',[room_id,account_id_join,date],function(err,result)
            {
                con.release();


                if(err)
                {
                    console.log("add member to room is fail:"+err);
                }else{
                    console.log('add member to room is successfully');


                }

            });

        });
    };

    this.infroRoom=function(room_id,callback)
    {
        connection.acquire(function(err,con){
            con.query('CALL App_GetInforRoom(?)',[room_id],function(err,result)
            {
                con.release();
                if(err)
                {
                  //  res.send({ status:-1});
                   callback(null);
                }else
                {
                  callback (result[0]);


                }
            });


        });
    };

    this.leftroom=function(room_id,account_id_left)
    {
//        DELETE FROM Room_Account WHERE account_id=1 AND room_id=1
        connection.acquire(function(err,con){
            con.query('DELETE FROM Room_Account WHERE  room_id=? AND account_id=? ',[room_id,account_id_left],function(err,result)
            {
                con.release();
                if(err)
                {
                   // res.send({ status:-1});
                }else
                {
                    //res.send({ status:HttpStatus.OK});


                }
            });


        });
    };
};

this.getrooms=function(account_id,res)
{
    connection.acquire(function(err,con){
        con.query('SELECT Room.room_id, Room.room_name FROM Room_Account ,Room WHERE account_id=? AND Room.room_id=Room_Account.room_id',[account_id],function(err,result)
        {
            con.release();
            if(err)
            {
                console.log('err: '+err);
                res.send({ status:1,result:err });
            }else
            {
                res.send({ status:HttpStatus.OK,result:result });
            }
        });


    });
};

module.exports= new Room();

