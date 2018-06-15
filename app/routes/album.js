/**
 * Created by Admin on 6/1/16.
 */

var fs =require('fs-extra');    //File System-needed for renaming file etc
var bodyParser = require('body-parser');
var config = require('nconf');
var HttpStatus = require('http-status-codes');
var upload=require('../models/upload');
var album_model=require('../models/album');
var newfeedmodel=require('../models/newfeed');
var image=require('../models/image');

var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads')
    },
    filename: function (req, file, cb) {
      
      cb(null, Date.now()+'.jpg');
      
  }
})
var uploadImgs = multer({ storage: storage }).single('avatar');

module.exports = function(router) {
    'use strict';
  
    router.use(bodyParser.urlencoded({ limit:'50mb',extended: true }));


    router.route('/').get(function(req,res){
        res.end("Node-File-Upload");

    });
    router.route('/upload').post( function(req, res) {

        upload.upload_image(req,function(url)
        {
            if(url==null)
            {
                res.json({'response':"Error: "});
            }else
                res.send({status: HttpStatus.OK,url: url});
        });
    });

    router.route('/createalbum').post(function(req,res)
    {
        album_model.create_album(req.body,res,function(id_album)
        {
            if(id_album)
            {
                if(id_album<0)
                {
                    res.send({status:-1});
                }else{
                    res.send({status:HttpStatus.Ok});
                }
            }

        });
    });

    router.route('/addimgetoalbum').post(function(req,res){

        console.log("addimgetoalbum: %",req.body);

//        upload.upload_image(req.body,function(url)
//        {
            if(req.body.url==null)
            {
                res.send({status: -1,message: 'Image  not be create'});
            }else
            {
                req.body.newfeed_id=-1;
                image.addimage(req.body,function(idimage){
                    if(idimage<0)
                    {
                        res.send({status: -1});
                    }else
                    {
                        res.send({status: HttpStatus.OK,result:{id:idimage,url:req.body.url}});
                    }
                });


            }

//        });
    });
 /// upload image to ablbum (ios)
  router.route('/uploadImageAlbumIOS').post(function(req,res){
    
    uploadImgs(req,res,function(err){
      var url = "";
      if(err)
      {
        console.log("upload image error!");
        res.send({status: -1,message: 'upload image error!'});
      }
      else
      {
         console.log("upload image Success!");
         url = 'http://'+config.get('HOST')+':'+config.get('NODE_PORT_LOCAL')+'/images/uploads/'+req.file.filename;
         console.log("URL: "+ url);
         req.body.url = url;
         req.body.newfeed_id=-1;
        image.addimage(req.body,function(idimage){
                    if(idimage<0)
                    {
                        res.send({status: -1});
                    }else
                    {
                        res.send({status: HttpStatus.OK,result:{id:idimage,url:req.body.url}});
                    }
                });   
      }

    });
  });

/// upload image to timeline (ios)
  router.route('/uploadImageTimelineIOS').post(function(req,res){
    
    uploadImgs(req,res,function(err){
      var url = "";
      if(err)
      {
        console.log("upload image error!");
        res.send({status: -1,message: 'upload image error!'});
      }
      else
      {
         console.log("upload image Success!");
         url = 'http://'+config.get('HOST')+':'+config.get('NODE_PORT_LOCAL')+'/images/uploads/'+req.file.filename;
         console.log("URL: "+ url);
         res.send({status: HttpStatus.OK,result:{url:url}});  
      }

    });
  });


    router.route('/getallimages').post(function(req,res)
    {
        album_model.get_images(req.body,res);
    });

    router.route('/gettopimages').post(function(req,res){
        album_model.get_top_24images(req.body,res);
    });

    router.route('/deleteimage').post(function(req,res){
        album_model.delete_image(req.body,res);
    });



}



