/**
 * Created by Admin on 6/1/16.
 */
var connection = require('../../config/initializers/database');
var HttpStatus = require('http-status-codes');
var functionUtil=require('../server/functionUtil');

function album()
{
    this.create_album=function(body,callback)
    {
        var day=functionUtil.getcurrenttime();
        connection.acquire(function(err,con){

                con.query('Call App_create_album(?,?,?)',[body.name,body.description,day],function(err,result){
                        con.release();
                        if(err)
                        {
                            console.log("create album is fail: "+err);
                            callback(-1);
                        }else
                        {
                            var id= result[0][0].album_id;
                            console.log("create album is success: "+id);
                            callback(id);
                        }
                    });
            }
        );
    };

    this.get_albums=function(res)
    {
        var sql='SELECT * FROM Album';
        connection.acquire(function(err,con){
            con.query(sql,function(err,result){
                con.release();

                if(err)
                {
                  res.send({status:-1});
                }else{
                    res.send({status:HttpStatus.OK,resutl:result});
                }
            });
        });
    };


    this.get_images=function(body,res)
    {
        var sql='call App_GetAllImages('+body.account_id+')';
        connection.acquire(function(err,con){
            con.query(sql,function(err,result){
                con.release();

                if(err)
                {
                    res.send({status:-1});
                }else{
                    res.send({status:HttpStatus.OK,result:result[0]});
                }
            });
        });
    };

    this.get_top_24images=function(body,res)
    {
        var sql='call App_GetTop24images('+body.account_id+')';
        connection.acquire(function(err,con){
            con.query(sql,function(err,result){
                con.release();

                if(err)
                {
                    res.send({status:-1});
                }else{
                    //console.log(result);
                    res.send({status:HttpStatus.OK,result:result[0]});
                }
            });
        });
    };


    this.delete_image=function(body,res)
    {
        var day=functionUtil.getcurrenttime();


        connection.acquire(function(err, con) {

            con.query('call App_DeleteImage(?,?) ', [body.url,day],function(err,result){
                con.release();
                if(err)
                {
                    res.send({status: 3, message: 'Failed to send request friend'});
                }else
                {
                    console.log('deleteimage: %',result);
                    res.send({status: HttpStatus.OK});
                }
            });

        });

    };



}

module.exports = new album();