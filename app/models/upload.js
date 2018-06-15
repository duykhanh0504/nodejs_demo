/**
 * Created by Admin on 5/26/16.
 */
var fs =require('fs-extra');    //File System-needed for renaming file etc
var config = require('nconf');
var express = require('express');
var multer  = require('multer');

var  app = express();
exports.upload_image = function upload_image(body,callback)
{
    var data='data:image/jpeg;base64,'+body.base64;

    var imageBuffer = decodeBase64Image(data);

    var dirname = 'public/images/uploads/';
    var newPath = dirname +  body.image;
    fs.writeFile(newPath, imageBuffer.data, function(err) {
        if(err){
            callback(null);

        }else {

            var url='http://'+config.get('HOST')+':'+config.get('NODE_PORT_LOCAL')+'/images/uploads/'+body.image;
            console.log('upload_image==========url:  '+url);
            callback(url);

        }
    });
}
//{

//    var newPath = 'public/images/uploads/' +  body.image;
//
//    base64_decode(body.base64,newPath,body.image,callback);
//}

function base64_decode(data, file,name,callback) {


//    var bitmap = new Buffer( data,'base64' );
    var bitmap = new Buffer(data, 'base64,');
    bitmap.poolSize=0;
    fs.writeFileSync(file, bitmap);


    var url='http://'+config.get('HOST')+':'+config.get('NODE_PORT_LOCAL')+'/images/uploads/'+name;
    callback(url);

}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};


    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads')
    },
    filename: function (req, file, cb) {

        cb(null,Date.now()+'.mp3');


    }
});

//var upload = multer({ storage : storage},{limits : {fieldNameSize : 10}}).single('recordfile');
exports.upload_mp3=function(body,callback)
{
    var data='data:'+body.type+';base64,'+body.file;

    var imageBuffer = decodeBase64Image(data);
    var dirname = 'public/images/uploads/';
    var newPath = dirname +  body.namefile;
    fs.writeFile(newPath,imageBuffer.data, function(err) {
        if(err){
            callback(null);

        }else {

            var url='http://'+config.get('HOST')+':'+config.get('NODE_PORT_LOCAL')+'/images/uploads/'+body.namefile;
            console.log('upload_image==========url:  '+url);
            callback(url);

        }
    });

};




