/**
 * Created by Dieu Nguyen on 5/6/16.
 */

var OneSignalAppId="cf2ccf57-e218-465e-94b9-e206b1cb8ebb";
var OneSignalRestAPIKey="MWFhN2JhODktYmY4ZS00YzAwLWJhMWEtMTY4NmE1YWZjMjA2";
var API_KEY_SERVER = 'AIzaSyCkF3Ob6YU93ruS8TnEvz4OTst7C3UZF7I';
var https = require('https');
var host="onesignal.com";
var sendNotification_link="/api/v1/notifications";
var addNewDevice_Link="/api/v1/players";

var define=require('../server/defines');
var client =require('../server/client');

var server=require('../../config/initializers/server.js');

var connection = require('../../config/initializers/database');
var HttpStatus = require('http-status-codes');
var localizePushNotification = require('../../app/models/LocalizePushNotification');

function OneSignalPush(){



this.addNewDevice =function(data,res1)
{
    console.log("=======addnew: "+data);
    var headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic "+OneSignalRestAPIKey
    };
    data.app_id=OneSignalAppId;
    data.language='en';
    data.identifier=API_KEY_SERVER;
    switch (data.device_type)
    {
        case '1':
            data.device_model='Android Device'
            break;

        case '0':
            data.device_model='IOS Device'
            break;
        default :
            data.device_model='new Device'
            break;
    }

    var options = {
        host: host,
        port: 443,
        path: addNewDevice_Link,
        method: "POST",
        headers: headers
    };

    var req = https.request(options, function(res) {

        res.on('data', function(data) {
            console.log("Response:");
            console.log(JSON.parse(data));
            res1.send(JSON.parse(data));
        });


    });

    req.on('error', function(e) {
        console.log("ERROR:");
        console.log(e);
    });

    var r =JSON.stringify(data);

    req.write(r);
    req.end();



};
this.sendNotification = function(reciever_id,sender_id,typepush,more) {
    var sender=server.getFromList(sender_id);

    var receiver=server.getFromList(reciever_id);
    if(receiver!=null)
        return;

    connection.acquire(function(err, con) {
        con.query('call App_isPush(?) ', [reciever_id],function(err,result){
            con.release();
            if(result==null || result[0]==null || result[0][0] ==null)
                return;
            console.log('isnotification: %',result[0]);
            if(err)
            {
                //res.send({status: 3, message: 'getMyFriends is fail'});
            }else
            {
               if(result[0][0]['isnotification']==1)
               {
                //ios push
                if (result[0][0]['device'] == 'ios')
                 {
                  console.log("push for ios");

                    try
                          {

                          var contentShow = localizePushNotification.contentShow(typepush,sender, more);
                              console.log(contentShow);
                            var message={
                             app_id: OneSignalAppId,
                             contents: contentShow,
                              ios_badgeType: "Increase",
                              ios_badgeCount: 1,
                             tags:[{"key": define.keypush, "relation": "=", "value": reciever_id}]
                             }

                          }catch(ex)
                          {
                            console.log('error json: '+ex);
                            return;
                          }
                     
                 }
                 else //android push
                 {
                  try{
                       var message={
                           app_id: OneSignalAppId,

                           contents: {"en": '{sender:"'+sender.userData['fullname']+'",type:' +typepush+',more: '+more+'}'},
                           tags:[{"key": define.keypush, "relation": "=", "value": reciever_id}]
                       }
                   }catch(ex) {
                       return;
                   }
                  
                 }

                  var headers = {
                       "Content-Type": "application/json",
                       "Authorization": "Basic "+OneSignalRestAPIKey
                   };
                   var options = {
                       host: host,
                       port: 443,
                       path: sendNotification_link,
                       method: "POST",
                       headers: headers
                   };



                   var req = https.request(options, function(res) {
                       res.on('data', function(message) {
                           console.log("Response:");
                           console.log(JSON.parse(message));
                       });
                   });

                   req.on('error', function(e) {
                       console.log("ERROR:");
                       console.log(e);
                   });

                   req.write(JSON.stringify(message));
                   req.end();
                   
               }
            }
        });
    });
};
}
module.exports = new OneSignalPush();

