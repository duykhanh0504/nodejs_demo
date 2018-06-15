/**
 * Created by Tuong on 9/23/16.
 */
var csv = require("fast-csv");
var server=require('../../config/initializers/server.js');
var connection = require('../../config/initializers/database');
var async = require("async");
function Localize()
{
    this.ReadLocalize = function (callback) {
        var arrData = [];
        csv
            .fromPath("public/LocalizePushIOS.csv")
            .on("data", function(data){

                arrData.push(data);
            })
            .on("end", function(){
                console.log("done");
                callback(arrData);

            });

//rr()

    };

    var rr=exports.readfile=function()
    {
        var arrData1 = [];
        csv
            .fromPath("public/nationality.csv")
            .on("data", function(data){

                arrData1.push(data);
            })
            .on("end", function(){
                async.each(arrData1,
                    // 2nd param is the function that each item is passed to
                    function(item, callback){
                        // Call an asynchronous function, often a save() to DB
                        console.log("====== "+item[0]+item[1]+item[2]);

                        connection.acquire(function(err,con){
                            con.query('INSERT INTO Nationality(VietName,Japan,English) VALUES (?,?,?)',[item[0],item[2],item[1]],function(err){

                                if(err)

                                {
                                    console.log("err: "+i+",  "+err);
                                }

                                con.release();
                            });
                        });
                    },

                    function(err){

                        console.log("done");
                    }
                );


            });
    }

   this.contentShow = function (typepush, sender, more) {
       var localizeData = server.localizeData();
console.log("type push: "+ typepush );
        if (typepush == '10') {
          typepush = '9';
        };
       switch(typepush)
       {
           case '1': var content = {"vi": localizeData[typepush][1] + " " + sender.userData['fullname'],
               "en": localizeData[typepush][2] + " " + sender.userData['fullname'],
               "ja": sender.userData['fullname'] + localizeData[typepush][3]
           };
               return content;
               break;


           case '4': var content = {"vi": localizeData[typepush][1] + " " + sender.userData['fullname'],
               "en": localizeData[typepush][2] + " " + sender.userData['fullname'],
               "ja": sender.userData['fullname'] + localizeData[typepush][3]
           };
               return content;
               break;

           case '5':  var content = {"vi": JSON.parse(more).newmember + localizeData[typepush][1],
               "en": JSON.parse(more).newmember + localizeData[typepush][2],
               "ja": JSON.parse(more).newmember + localizeData[typepush][3]
           };
               return content;
               break;

            case '9':  var content = {"vi": sender.userData['fullname'] + localizeData[typepush][1] + JSON.parse(more).room_name,
               "en": sender.userData['fullname'] + localizeData[typepush][2] + JSON.parse(more).room_name,
               "ja": sender.userData['fullname'] + localizeData[typepush][3] + JSON.parse(more).room_name
           };
               return content;
               break;

            case '10':  var content = {"vi": sender.userData['fullname'] + localizeData[typepush][1] + JSON.parse(more).room_name,
               "en": sender.userData['fullname'] + localizeData[typepush][2] + JSON.parse(more).room_name,
               "ja": sender.userData['fullname'] + localizeData[typepush][3] + JSON.parse(more).room_name
           };
               return content;
               break;

           default: var content = {"vi": sender.userData['fullname'] + localizeData[typepush][1],
               "en": sender.userData['fullname'] + localizeData[typepush][2],
               "ja": sender.userData['fullname'] + localizeData[typepush][3]
           };
               return content;
               break;
       }
   };

}


module.exports = new Localize();
