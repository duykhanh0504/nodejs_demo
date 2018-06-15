/**
 * Created by Admin on 5/11/16.
 */

var defines = require('../server/defines');
var logger=require('winston');
var message=require("./../models/message");
async = require("async");
var gameserver=require("../../config/initializers/server");

var push=require('../models/OneSignalPush.js');


var roommodule=require('../modules/roommodule.js');

var roommodel=require('../models/room.js');

var util=require('../server/functionUtil.js');

exports.onChatPublic = function(client, data)
{

    var room_id=data['room_id'];
    var receiver_ids='';
    var room=roommodule.onGetRoom(room_id);
    var ispush=1;


    for(var i=0;i<room.members.length;i++)
    {
        if(room.members[i]!=client.userData['account_id'])
        {
            receiver_ids+=room.members[i]+',';
        }

    }


        var datalog=
        {
            from_account_id:client.userData['account_id'],
            to_account_ids:','+receiver_ids,
            message:data['message'],
            create_date:util.getcurrenttime(),
            room_id:data['room_id']

        };
        if(data['ispush'])
        {
            ispush=data['ispush'];
        }



        message.addmessage(datalog,function(id)
        {
            if(id==-1)
                return;

            if(client==null)
                return;


            var message_to_users={
                type:defines.MessageToClient.ChatPublic,
                from_account_id:client.account_id,
                from_username:client.userData['fullname'],
                from_avarta: client.userData['avarta'],
                message:datalog.message,
                create_date:datalog.create_date,
                room_id:room_id,
                message_id:id+''
            };
            client.socket.broadcast.to(room_id).emit(defines.KeyMessageToClient, message_to_users);

            var members=receiver_ids;
            var temp='';
            for(var i= 0; i<members.length;i++)
            {
                if(members[i]==',')
                {
                    var friend =gameserver.getFromList(temp);
                    if(friend==null)
                    {
                        if(ispush==1)
                        {

                            var more='{"message_type":'+message_to_users.message.type +',"room_name":"'+room.name+'"}';
                            push.sendNotification(temp,client.account_id,defines.MessagePush.newmessage+'',more);
                        }
                    }
                    temp='';
                }else
                {
                    temp+=members[i];
                }
            }
        });

}

exports.onChatPrivate = function(client, data)
{

    var friend_id=data['receiver_id'];
    var friend =gameserver.getFromList(friend_id);
    var dataLog={
        from_account_id:client.account_id,
        to_account_ids:','+data['receiver_id']+',',
        message:data['message'],
        create_date:util.getcurrenttime(),
        room_id:-1
    };
    message.addmessage(dataLog,function(id)
    {
            if(id==-1)
                return;



            if(friend!=null)
            {
                    var data1={
                        type:defines.MessageToClient.ChatPrivate,
                        from_account_id:client.account_id,
                        from_username:client.userData['fullname'],
                        from_avarta: client.userData['avarta'],
                        message:dataLog.message,
                        create_date:dataLog.create_date,
                        genner:client.userData['sex'],

                        message_id:id+''
                    };




                     client.socket.broadcast.to(friend.clientId).emit(defines.KeyMessageToClient,data1);
                    }
            else
            {
                var more='{"message_type":'+dataLog.message.type +'}';
                push.sendNotification(friend_id,client.account_id,defines.MessagePush.newmessage+'',more);
            }
    });

}
