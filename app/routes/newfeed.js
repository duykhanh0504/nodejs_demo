/**
 * Created by Admin on 7/26/16.
 */

var newfeed=require('../models/newfeed.js');
var functionUtil=require('../server/functionUtil')
var HttpStatus = require('http-status-codes');
var upload=require('../models/upload');
var image =require('../models/image');
module.exports = function(router) {

    router.route('/postnewfeed').post(function(req,res){
        newfeed.addnewfeed(req.body,function(idnewfeed)
        {
            if(idnewfeed<0)
            {
                res.send({status: -1});
            }else
            {
                res.send({status: HttpStatus.OK});
            }
        });
    });


    router.route('/postnewfeed_image').post(function(req,res){
        newfeed.addnewfeed(req.body,function(newfeedid){

            var urls=[];
           var base64s=req.body.base64.split(',');

            for(var i=0;i<base64s.length-1;i++)
            {
                var b={
                    base64:base64s[i],
                    image:req.body.image+i+'.jpg'
                };


                upload.upload_image(b,function(url){
                    urls.push(url);
                    var bb={
                        url:url,
                        description:'',
                        newfeed_id:newfeedid,
                        account_id:req.body.account_id
                    };
                    image.addimage(bb,function(id){

                    });
                    //body.url,body.description,day,body.newfeed_id,body.account_id
                });
            }
            res.send({status: HttpStatus.OK});

        });
    });

    router.route('/postnewfeed_image_ios').post(function(req,res){
        newfeed.addnewfeed(req.body,function(newfeedid){

            var urls=[];
            var urls=req.body.url.split(',');

            for(var i=0;i<urls.length-1;i++)
            {




                    var bb={
                        url:urls[i],
                        description:'',
                        newfeed_id:newfeedid,
                        account_id:req.body.account_id
                    };
                    image.addimage(bb,function(id){

                    });
            }
            res.send({status: HttpStatus.OK});

        });
    });

    router.route('/getnewfeed').post(function(req,res){
        newfeed.getnewfeed(req.body,res);
        }
    );

    router.route('/getnewfeed_nearfriend').post(function(req,res){
            newfeed.getnewfeed_nearfriend(req.body,res);
        }
    );

    router.route('/clicklike').post(function(req,res){
        newfeed.likenewfeed(req.body,res);
    });

    router.route('/likes').post(function(req,res){
        newfeed.getuserlikenewfeed(req.body,res);
    });

    router.route('/comments').post(function(req,res){
        newfeed.getcommentnewfeed(req.body,res);
    });

    router.route('/postcomment').post(function(req,res){
        newfeed.postcomment(req.body,res);
    });


    router.route('/deletenewfeed').post(function(req,res){
        newfeed.deletenewfeed(req.body,res);
    });
    router.route('/updatenewfeed').post(function(req,res){
        newfeed.updatenewfeed(req.body,res);
    });


}
