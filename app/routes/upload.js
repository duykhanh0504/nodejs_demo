/**
 * Created by Admin on 6/16/16.
 */


var HttpStatus = require('http-status-codes');

var upload=require('../models/upload.js');


module.exports = function(router) {
    router.route('/upload')
        .post(function(req,res){
            upload.upload_image(req.body,function(url)
            {
                if(url!=null)
                    res.send({status: HttpStatus.OK, url: url});
                else
                    res.send({status: 1,message: 'upload fail'});
            });
        });

    router.route('/uploadmp3')
        .post(function(req,res){
            upload.upload_mp3(req.body,function(url)
            {
                if(url!=null)
                {
                    console.log('');
                    res.send({status: HttpStatus.OK, url: url});
                }
                else
                    res.send({status: 1,message: 'upload fail'});
            });
        });
};