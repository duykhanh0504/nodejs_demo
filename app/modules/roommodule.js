/**
 * Created by Admin on 5/12/16.
 */
var _ = require("underscore");
var gameserver=require('../../config/initializers/server');
var MAX_USER_IN_ROOM = 20;
var roomIncCount = 0;
var roomList = [];
var room=require('../models/room');
var defines=require('../server/defines');
var push=require('../models/OneSignalPush.js');
var chatModule=require('../modules/chatmodule.js');
var util=require('../server/functionUtil.js');

function RoomInfo()
{
    this.id = "";
    this.name = "";
    this.members=[];
    this.max = MAX_USER_IN_ROOM;
}//room prototype

var findRoomByRoomId =exports.findRoomByRoomId=function(id)
{
    for(var i=0; i< roomList.length;i++)
    {
        var _room=roomList[i];
        if(_room.id==id)
            return _room.id;
    }
    return -1;
};

var onGetRoom=exports.onGetRoom=function(id)
{
    for(var i=0; i< roomList.length;i++)
    {
        var _room=roomList[i];
        if(_room.id==id)
            return _room;
    }
    return null;
}
exports.onCreatRoom=function(client,data,resp)
{
    var dataroom={
        roomname:data.room_name,
        account_id_create:client.userData['account_id'],
        avarta:data.room_avarta
    };
    room.newroom(dataroom,function (id){

        var r=new RoomInfo();
        r.id=id;
        r.name=data.roomname;

        roomList.push(r);
        var temp='';

        for(var i= 0; i<data.member.length;i++)
        {
            if(data.member[i]==',')
            {
                r.members=  util.addToList(r.members, temp+'',true);


                var cl=gameserver.getFromList(temp);

                if(cl!=null)
                {
                    cl.socket.join(id);
                    cl.room_id=id;
                    if(temp!=data.account_id)
                    {

                        var data1={
                              type:defines.MessageToClient.createroom,
                              room_id:id,
                              roomname:data.room_name,
                              room_avarta:data.room_avarta,
                              groupcreator:client.userData['account_id']+'',
                              groupcreator_username:client.userData['username'],
                              groupcreator_avarta:client.userData['avarta'],
                              create_day:util.getcurrenttime()+'',
                              members:data.member
                        };

                       client.socket.broadcast.to(cl.clientId).emit(defines.KeyMessageToClient,data1);

                    }

                }else
                {

                    var room_name=(data.room_name+'');

                    var more='{"room_name":"'+ room_name+'"}';
                    push.sendNotification(temp,client.account_id,defines.MessagePush.create_room,more);
                }
                room.joinroom(id,temp);
                temp='';
            }else
            {
                temp+=data.member[i];
            }
        }



        var message={
            type:defines.MessageType.notification,
            message:''

        };
        var datachat={
            room_id:id,
            message:message,
            ispush:'false'

        };
        chatModule.onChatPublic(client,datachat);

        var retObj = {
            type:defines.RequestType.CreateRoom,
            room_id:id,
            roomname:data.room_name,
            members:data.member,
            errCode:defines.ErrorCode.OK
        };
        resp(retObj);
    });
};

exports.onInviteUser=function(client,data,resp)
{
    if(findRoomByRoomId(data.room_id)>=0)
    {

        room.infroRoom(data.room_id,function(dataroom){
        var dataroom=dataroom[0];

            var r='';
        for(var i=0;i<roomList.length;i++)
        {
            if(roomList[i].id==data.room_id)
            {
                r=roomList[i];
                break;
            }
        }




        r.members = util.addToList(r.members,data.friend_id+'');
        var friend=gameserver.getFromList(data.friend_id);


        if(friend!=null)
        {
            friend.socket.join(data.room_id);
            friend.room_id=data.room_id;

            var data1={
                type:defines.MessageToClient.AddToRoom,
                room_id:data.room_id,
                roomname:dataroom.room_name,
                room_avarta:dataroom.avarta,
                sender_id:client.userData['account_id']+'',
                sender_username:client.userData['username'],
                sender_avarta:client.userData['avarta'],
                create_day:util.getcurrenttime()+'',
                members: r.members
            };

            client.socket.broadcast.to(friend.clientId).emit(defines.KeyMessageToClient,data1);


        }else
        {
            var more='{"room_name":"'+dataroom.room_name+'"}';
//
            console.log('friend_id:  '+data.friend_id);
            push.sendNotification(data.friend_id,client.userData['account_id'],defines.MessagePush.invite_to_room+'',more);


        }
        var data1={
                   type:defines.MessageToClient.NewMember,
                   room_id:data.room_id,
                   roomname:dataroom.room_name,
                   room_avarta:dataroom.avarta,
                   sender_id:client.userData['account_id']+'',
                   sender_username:client.userData['username'],
                   sender_avarta:client.userData['avarta'],
                   create_day:util.getcurrenttime()+'',
                   members: r.members,
                   newmember:{id:data.friend_id+'', avarta:data.friend_avarta,username:data.friend_username}
        };

        client.socket.broadcast.to(data.room_id).emit(defines.KeyMessageToClient,data1);
        for(var i=0;i< r.members.length;i++)
        {
            if(r.members[i]==data.friend_id || r.members[i]==client.userData['account_id'])
            {

            }else
            {
                if(gameserver.getFromList(r.members[i])==null){
                    var more='{"room_name":"'+dataroom.room_name+'","newmember":"'+data.friend_username+'"}';
                    push.sendNotification(r.members[i],client.userData['account_id'],defines.MessagePush.newuser_joinroom+'',more);


                }

            }
        }


        room.joinroom(data.room_id,data.friend_id);

            for(var i=0;i<roomList.length;i++)
            {
                if(roomList[i].id==data.room_id)
                {
                    roomList[i]=r;
                    break;
                }
            }

        var message={
            type:defines.MessageType.notification,
                message:''
            };
         var datachat={
                room_id:data.room_id,
                message:message,
                ispush:'false'

            };
        chatModule.onChatPublic(client,datachat);

            var retObj = {
                type:defines.RequestType.InviteUser,

                errCode:defines.ErrorCode.OK
            };
            resp(retObj);

        });
    }else
    {
        console.log('room khong ton tai, wtf');
    }
};



exports.onJoinRoom = function(client, data, resp)
{
    client.room_id=data.room_id;
    client.socket.join(data.room_id);
    room.infroRoom(data.room_id,function(dataroom){
        var dataroom=dataroom[0];

        if(findRoomByRoomId(data.room_id)<0)
        {
            var r=new RoomInfo();
            r.id=data.room_id;
            r.name=dataroom.room_name;

            var temp='';

            var members=JSON.parse(dataroom.members);

            for(var i=0;i<members.length;i++)
            {
                var u=members[i];
                r.members=  util.addToList(r.members, u.id+'',true);
            }


        roomList.push(r);
        }else
        {


            for(var i=0;i<roomList.length;i++)
            {
                if(roomList[i].id==data.room_id)
                {
                    var members=JSON.parse(dataroom.members);

                    for(var j=0;j<members.length;j++)
                    {
                        var u=members[j];
                        roomList[i].members=  util.addToList(roomList[i].members, u.id+'',true);


                    }

                    break;
                }
            }
        }





        var retObj = {
            type:defines.RequestType.JoinRoom,
            room_id: dataroom.room_id,
            members:dataroom.members,
            groupcreator:dataroom.account_id_create,
            errCode:defines.ErrorCode.OK
        };

        console.log("member: %",retObj);
        resp(retObj);
    });

};

exports.onLeftCurrentRoom = function(client, data, resp){
    client.socket.leave(data.room_id);

    var r=onGetRoom(data.room_id);

        var datares={
               type:defines.MessageToClient.Leaveroom,
               room_id:data.room_id,
               roomname: data.room_name,
               leaver_id:client.userData['account_id']+'',
               leaver_user:client.userData['username'],
               time_leave:util.getcurrenttime()
          };

        room.leftroom(data.room_id,client.account_id);

    for(var i=0;i<roomList.length;i++)
    {
        if(roomList[i].id==data.room_id)
        {
           roomList[i].members=  util.removeFromList(roomList[i].members, client.userData['account_id']+'');

            for(var j=0;j<roomList[i].members.length;j++)
            {
                var f=gameserver.getFromList(roomList[i].members[j]);
                if(f==null)
                {
                    var more='{"room_name":"'+data.room_name+'"}';
                    push.sendNotification(roomList[i].members[j],client.userData['account_id'],defines.MessagePush.user_leave_room+'',more);
                }
            }

           break;
        }
    }

    client.socket.broadcast.to(data.room_id).emit(defines.KeyMessageToClient,datares);

    var message={
        type:defines.MessageType.notification,
        message:''
    };
    var datachat={
        room_id:data.room_id,
        message:message,
        ispush:'false'

    };
    chatModule.onChatPublic(client,datachat);

    var retObj = {
        type:defines.MessageToClient.Leaveroom,
        errCode:defines.ErrorCode.OK

    };
    resp(retObj);
};

