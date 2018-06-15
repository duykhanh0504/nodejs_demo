/**
 * Created by Dieu Nguyen on 5/11/16.
 */
"use strict";

var requestType = require("./defines").RequestType;
var messageType = require("./defines").MessageTypeClient_Server;
var logger=require('winston');
var defines=require("./defines");
var gameserver=require("../../config/initializers/server");
var chatModule=require("./../modules/chatmodule");
var user=require('../models/user.js');
var roomModule=require('../modules/roommodule');

//exports.Client= function(socket,server){
module.exports.Client=function(socket,server)
{
    this.socket=socket;
    this.server=server;

    socket.clientRef = this;
    logger.info("client " + socket.id + " connect to server");
    //client members, save for convenient using
     this.clientId = socket.id;
   this.account_id = null;
    this.username = null;
    this.room_id = [];
    //user data
    this.userData = null;//tham chieu toi data DB


     var self = this;

    var onMessage = function (data) {
        if(!self) {
            logger.error("onMessage:CLIENT NULL CMNR!!!");
            return;
        }
        var type = parseInt(data.type);
        logger.debug("handle message: type=" + type + " data=" + JSON.stringify(data));
        var handler = messageHandlers[type];
        if (handler != null)
        {
            try
            {
                handler(self, data);
            }
            catch(ex)
            {
                logger.error("handler message " + type + " with error " + ex + "\n" + ex.stack);
            }
        }
        else
        {
            logger.error("unprocessed message " + type);
        }

    };

    var onRequest = function (data, resp) {
        if(!self) {
            logger.error("CLIENT NULL CMNR!!!");
            resp({retCode:defines.ErrorCode.NOT_FOUND});
            return;
        }
        var type = parseInt(data.type);
        if(type != 0)
            logger.debug("handle request: type=" + type + " data=" + JSON.stringify(data));

        if(!resp)
        {
            logger.error("Ko co resp ---> TROLL ah " + self.clientId);
        }
        var handler = requestHandlers[type];
        if (handler != null)
        {
            try
            {
                handler(self, data, resp);
            }
            catch(ex)
            {
                logger.error("handler request " + type + " with error " + ex + "\n" + ex.stack);
                resp({retCode:defines.ErrorCode.FAILED});
            }
        }
        else
        {
            logger.error("unprocessed request " + type);
            resp({retCode:defines.ErrorCode.NOT_FOUND});
        }

    };

    var onDisconnect = function () {
        logger.info('                  '+self.account_id + ' disconnected');
        self.socket.broadcast.to(self.room_id).emit(defines.MessageToClient.Disconnect, {clientId:self.clientId});
        for(var i=0;i<self.room_id.length;i++)
        {
            self.socket.leave(self.room_id[i]);
        }

        user.logout(self.account_id);
        gameserver.removeFromList((self.account_id));


    };

    var onLogOut=function()
    {
        console.log('=========================log out');
        self.socket.broadcast.to(self.room_id).emit(defines.MessageToClient.Logout, {clientId:self.clientId});
        for(var i=0;i<self.room_id.length;i++)
        {
            self.socket.leave(self.room_id[i]);
        }

        gameserver.removeFromList((self.account_id));


        user.logout(self.account_id);


    }


    var ticks = 0;//ko update lan dau
    var updateClient = function()
    {
        ticks++;
    };


    var destroyMe = function()
    {
        logger.debug("destroyMe:" + socket.client);
    };

    exports.updateInfo = function(data)
    {
        self.username = data.username;
        self.account_id = data.account_id;
        self.room_id = data.room_id;
        self.userData=data.userData;


        gameserver.addToList(self.account_id,self);

    };

    exports.account_id = function()
    {


       return self.account_id;

    };





    //receive all message from socket
    socket.on('message',onMessage);

    socket.on('request',onRequest);

    //when disconnected
    socket.on('disconnect',onDisconnect);
    socket.on('logout',onLogOut);


    var updateInteval = setInterval(updateClient, 1000);//update moi 1s

    var requestHandlers = {};
    var messageHandlers = {};
    messageHandlers[messageType.ChatPublic]                   = chatModule.onChatPublic;
    messageHandlers[messageType.ChatPrivate]                  = chatModule.onChatPrivate;

    requestHandlers[requestType.JoinRoom]          = roomModule.onJoinRoom;
    requestHandlers[requestType.LeftRoom]          = roomModule.onLeftCurrentRoom;
    requestHandlers[requestType.CreateRoom]        = roomModule.onCreatRoom;
    requestHandlers[requestType.InviteUser]        = roomModule.onInviteUser;


};


