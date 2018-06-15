/**
 * Created by DieuNguyen on 7/25/16.
 */
var connection = require('../../config/initializers/database');
var HttpStatus = require('http-status-codes');
var functionutil=require('../server/functionUtil');
var upload=require('../models/upload');

function image()
{
    exports.addimage=this.addimage=function(body,callback)
    {
        var day=functionutil.getcurrenttime();

        connection.acquire(function(err,con){
                con.query('Call App_insertimage(?,?,?,?,?)',[body.url,body.description,day,body.newfeed_id,body.account_id],
                    function(err,result){
                        con.release();
                        if(err)
                        {
                            console.log("insert image  is fail: "+err);
                            callback(-1);
                        }else
                        {
                            var id= result[0][0].image_id;
                            console.log("insert image is success: "+id);
                            callback(id);
                        }
                    }
                );
            }
        );
    };
}

module.exports = new image();
