/**
 * Created by Admin on 4/15/16.
 */

var user=require('../models/user');
var config = require('nconf');
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads')
    },
    filename: function (req, file, cb) {
      
      var _flat = req.body.flat;
      if(_flat == 'avatar')
      {
        cb(null, "avatar_"+ Date.now()+'.jpg')
      }
      else if(_flat == 'corver')
      {
        cb(null, "corver_"+ Date.now()+'.jpg')
      }
      else if (_flat == 'group')
      {
        cb(null,"group_"+ Date.now()+'.jpg');
      }
      else if (_flat == 'chat')
      {
        cb(null,"chat"+ Date.now()+'.jpg');
      }
      
        
  }
})

var uploadImgs = multer({ storage: storage }).single('avatar');

module.exports = function(router) {
    'use strict';
    // This will handle the url calls for /users/:user_id
    router.route('/')
        .get(function(req, res) {
           user.getInfromation_id(req.query.id,res);
        });

    router.route('/updateconvert').post(function(req,res)
    {
        user.updateConvert(req.body,res);
    });

    router.route('/update').post(function(req,res){
         user.update(req.body,res);
   });


    router.route('/readtutorial').post(function(req,res){
        user.isReadTutorial(req.body,res);
    });

    router.route('/updateNotification').post(function(req,res){
        user.setNotification(req.body,res);
    });


    /// upload avatar (ios)
  router.route('/updateAvatarIOS').post(function(req,res){
    
    uploadImgs(req,res,function(err){
      var url = "";
      if(err)
      {
        console.log("upload avatar error!");
        user.uploadSingleImageIOS(url,req.body,res); 
      }
      else
      {
         console.log("upload avatar Success!");
         url = 'http://'+config.get('HOST')+':'+config.get('NODE_PORT_LOCAL')+'/images/uploads/'+req.file.filename;
         user.uploadSingleImageIOS(url,req.body,res);       
      }

    });
  });

  ///upload corvert for ios
   router.route('/updateCorverIOS').post(function(req,res){
    
    uploadImgs(req,res,function(err){
      var url = "";
      if(err)
      {
        console.log("upload corver error!");
        user.uploadSingleImageIOS(url,req.body,res); 
      }
      else
      {
         console.log("upload corver Success!");
         url = 'http://'+config.get('HOST')+':'+config.get('NODE_PORT_LOCAL')+'/images/uploads/'+req.file.filename;
         user.uploadSingleImageIOS(url,req.body,res);       
      }

    });
  });

    /// upload avatar for ggroup (ios)
  router.route('/updateAvatarGroupIOS').post(function(req,res){
    
    uploadImgs(req,res,function(err){
      var url = "";
      if(err)
      {
        console.log("upload avatar group error!");
        res.send({status: 1, message: 'updaload error'});
      }
      else
      {
         console.log("upload avatar group Success!");
         url = 'http://'+config.get('HOST')+':'+config.get('NODE_PORT_LOCAL')+'/images/uploads/'+req.file.filename;
         res.send({status: 200, result: {url: url}});   
      }

    });
  });

/// upload image chat (ios)
  router.route('/updateImageChatIOS').post(function(req,res){
    
    uploadImgs(req,res,function(err){
      var url = "";
      if(err)
      {
        console.log("updateImageChatIOS error!");
        res.send({status: 1, message: 'updateImageChatIOS error'});
      }
      else
      {
         console.log("updateImageChatIOS Success!");
         url = 'http://'+config.get('HOST')+':'+config.get('NODE_PORT_LOCAL')+'/images/uploads/'+req.file.filename;
         res.send({status: 200, result: {url: url}});      
      }

    });
  });
    router.route('/updatesocket').post(function(req,res){
        user.updatesocket(req.body,res);
    });

    router.route('/searchuser').post(function(req,res){
        user.searchUser(req.body,res);
    });
};